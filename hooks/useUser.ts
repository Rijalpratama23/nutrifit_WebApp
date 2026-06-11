'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

export type UserProfile = {
  id: string;
  nama: string;
  email: string;
  phoro_url: string | null;
};

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      const authUser = session.user;

      // Ambil nama dari tabel users & foto dari ahli_profiles sekaligus
      const [{ data: userData }, { data: ahliData }] = await Promise.all([
        supabase.from('users').select('full_name').eq('id', authUser.id).single(),
        supabase.from('ahli_profiles').select('profile_photo_url').eq('user_id', authUser.id).eq('is_verified', true).maybeSingle(),
      ]);

      setUser({
        id: authUser.id,
        nama: userData?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email ?? '',
        // Prioritas: ahli_profiles → user_profiles → auth metadata (Google)
        phoro_url: ahliData?.profile_photo_url ?? authUser.user_metadata?.phoro_url ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading, error, refetch: fetchUser };
}
