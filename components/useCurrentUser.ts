'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/app/actions/userActions';
import type { SessionUser } from '@/lib/userAuth';

// Loads the logged-in customer (if any) once on the client.
export function useCurrentUser() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((u) => {
        if (active) setUser(u);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return { user, loaded };
}
