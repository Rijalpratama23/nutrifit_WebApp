'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

function getRedirectByRole(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'ahli':
      return '/ahli/home';
    default:
      return '/user/dashboardUser';
  }
}

export default function CallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Memproses login...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // ✅ Ambil code dari URL
        const code = new URLSearchParams(window.location.search).get('code');

        if (!code) {
          router.push('/login?error=no-code');
          return;
        }

        // ✅ Exchange code -> session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error('Exchange error:', exchangeError);
          router.push('/login?error=auth-failed');
          return;
        }

        // ✅ Sekarang baru ambil session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.push('/login?error=no-session');
          return;
        }

        const user = session.user;

        // ✅ Cek apakah email sudah dipakai akun lain
        const { data: existingByEmail } = await supabase
          .from('users')
          .select('id, role')
          .eq('email', user.email ?? '')
          .single();

        if (existingByEmail && existingByEmail.id !== user.id) {
          setStatus('Email sudah terdaftar...');
          await supabase.auth.signOut();
          setTimeout(() => router.push('/login?error=email-exists'), 1000);
          return;
        }

        // ✅ Upsert user ke tabel users (buat baru jika belum ada)
        await supabase.from('users').upsert(
          {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name ?? user.email,
            avatar_url: user.user_metadata?.avatar_url ?? null,
            role: existingByEmail?.role ?? 'user',
          },
          { onConflict: 'id' },
        );

        const role = existingByEmail?.role ?? 'user';
        setStatus('Login berhasil, mengalihkan...');
        router.push(getRedirectByRole(role));
      } catch (err) {
        console.error('Callback error:', err);
        router.push('/login?error=unknown');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      <p className="text-gray-600 text-sm">{status}</p>
    </div>
  );
}
