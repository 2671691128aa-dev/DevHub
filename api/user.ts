/**
 * /api/user — User info and stats (Serverless).
 *
 * GET /api/user/me    — current user info
 * GET /api/user/stats — conversation and message counts
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '@clerk/clerk-sdk-node';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function authenticate(req: VercelRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) return null;

  try {
    const payload = await verifyToken(token, { secretKey });
    return payload.sub;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = await authenticate(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { query } = req;

  // --- GET /api/user/me ---
  if (query.action === 'me') {
    // In production, fetch full user from Clerk API or Supabase
    // For now, return the Clerk user ID
    return res.status(200).json({
      id: userId,
    });
  }

  // --- GET /api/user/stats ---
  if (query.action === 'stats') {
    const supabase = getSupabase();

    const { count: conversationCount, error: convError } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (convError) return res.status(500).json({ error: convError.message });

    const { count: messageCount, error: msgError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .in(
        'conversation_id',
        (
          await supabase
            .from('conversations')
            .select('id')
            .eq('user_id', userId)
        ).data?.map((c) => c.id) ?? [],
      );

    if (msgError) return res.status(500).json({ error: msgError.message });

    return res.status(200).json({
      conversationCount: conversationCount ?? 0,
      messageCount: messageCount ?? 0,
    });
  }

  return res.status(400).json({ error: 'Invalid action. Use ?action=me or ?action=stats' });
}
