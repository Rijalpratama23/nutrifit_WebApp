'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

export type UserProfile = {
  id: string;
  nama: string;
  email: string;
  avatar_url: string | null;
};

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null); // ✅ pakai UserProfile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatUser = (sessionUser: any): UserProfile => ({
    id: sessionUser.id,
    nama: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'User',
    email: sessionUser.email || '',
    avatar_url: sessionUser.user_metadata?.avatar_url || null, // ✅ ambil foto Google
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setUser(session?.user ? formatUser(session.user) : null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? formatUser(session.user) : null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading, error };
}
