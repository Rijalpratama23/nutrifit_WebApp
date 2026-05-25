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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      // 1. Ambil session
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

      // 2. Ambil nama terbaru dari tabel users (bukan dari auth metadata)
      const { data: userData } = await supabase.from('users').select('full_name').eq('id', authUser.id).single();

      setUser({
        id: authUser.id,
        // Prioritas: tabel users → auth metadata → email prefix
        nama: userData?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email ?? '',
        avatar_url: authUser.user_metadata?.avatar_url ?? null,
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

    // Listen perubahan auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser(); // re-fetch dari DB setiap auth change
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Expose refetch agar bisa dipanggil manual setelah update nama
  return { user, loading, error, refetch: fetchUser };
}
