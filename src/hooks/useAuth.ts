/**
 * Auth hook — provides Clerk authentication state and token sync.
 *
 * Usage:
 *   const { isLoaded, isSignedIn, userId, user } = useAuth();
 *
 * IMPORTANT: Always check isLoaded before trusting isSignedIn.
 */
import { useAuth as useClerkAuth, useUser } from '@clerk/react';
import { useEffect } from 'react';
import { setClerkToken } from '@/lib/api-client';

export function useAuth() {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user } = useUser();

  // Keep the global token in sync so api-client can use it for server requests
  useEffect(() => {
    let cancelled = false;

    async function syncToken() {
      if (!isLoaded || !isSignedIn) {
        if (!cancelled) setClerkToken(null);
        return;
      }
      try {
        const token = await getToken();
        if (!cancelled) setClerkToken(token);
      } catch {
        if (!cancelled) setClerkToken(null);
      }
    }

    syncToken();

    // Refresh token every 50 seconds (Clerk tokens expire after 60s)
    const interval = setInterval(syncToken, 50_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
      setClerkToken(null);
    };
  }, [isLoaded, isSignedIn, getToken]);

  return {
    isLoaded: isLoaded ?? false,
    isSignedIn: isLoaded ? (isSignedIn ?? false) : false,
    userId: isSignedIn ? (user?.id ?? null) : null,
    user,
  };
}
