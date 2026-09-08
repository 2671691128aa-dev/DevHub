/**
 * /api/conversations — CRUD for chat conversations (Serverless).
 *
 * GET    /api/conversations          — list all conversations for user
 * GET    /api/conversations/:id      — get conversation with messages
 * POST   /api/conversations          — create conversation
 * PUT    /api/conversations/:id      — update conversation
 * DELETE /api/conversations/:id      — delete conversation
 * POST   /api/conversations/:id/messages — save a message
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

/** Verify Clerk token and return user ID, or null if auth fails */
async function authenticate(req: VercelRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    // Dev mode without Clerk secret — extract userId from body or return a dev fallback
    return (req.body as Record<string, unknown>)?.userId as string | null ?? null;
  }

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

  const supabase = getSupabase();
  const { id } = req.query;
  const method = req.method;

  // --- POST /api/conversations/:id/messages ---
  // This is handled by a separate check since the path pattern is different
  const urlParts = req.url?.split('/') ?? [];
  const isMessagesRoute =
    urlParts.length >= 5 && urlParts[urlParts.length - 1] === 'messages';

  if (isMessagesRoute && method === 'POST') {
    const conversationId = urlParts[urlParts.length - 2];
    const { role, content, status, error_code, token_count } = req.body as {
      role: string;
      content: string;
      status?: string;
      error_code?: string | null;
      token_count?: number | null;
    };

    if (!conversationId || !content) {
      return res.status(400).json({ error: 'conversationId and content required' });
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        status: status ?? 'sent',
        error_code: error_code ?? null,
        token_count: token_count ?? null,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Update conversation's updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)
      .eq('user_id', userId);

    return res.status(201).json(data);
  }

  // --- GET /api/conversations ---
  if (method === 'GET' && !id) {
    const { data, error } = await supabase
      .from('conversations')
      .select('id, user_id, title, model, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data ?? []);
  }

  // --- GET /api/conversations/:id ---
  if (method === 'GET' && id) {
    const convId = id as string;

    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', convId)
      .eq('user_id', userId)
      .single();

    if (convError || !conv) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    if (msgError) return res.status(500).json({ error: msgError.message });

    return res.status(200).json({ ...conv, messages: messages ?? [] });
  }

  // --- POST /api/conversations ---
  if (method === 'POST' && !id) {
    const { title, model } = req.body as { title: string; model: string };

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title: title ?? '新对话',
        model: model ?? 'claude-sonnet-4-20250514',
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  // --- PUT /api/conversations/:id ---
  if (method === 'PUT' && id) {
    const { title } = req.body as { title?: string };
    const convId = id as string;

    const { data, error } = await supabase
      .from('conversations')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', convId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Conversation not found' });
    return res.status(200).json(data);
  }

  // --- DELETE /api/conversations/:id ---
  if (method === 'DELETE' && id) {
    const convId = id as string;

    // Messages cascade delete via FK
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', convId)
      .eq('user_id', userId);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
