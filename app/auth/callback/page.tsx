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
        const code = new URLSearchParams(window.location.search).get('code');
        if (!code) {
          router.push('/login?error=no-code');
          return;
        }

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          router.push('/login?error=auth-failed');
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login?error=no-session');
          return;
        }

        const { data: userData } = await supabase
          .from('users')
          .select('id, role')
          .eq('email', session.user.email ?? '')
          .single();

        if (userData && userData.id !== session.user.id) {
          await supabase.auth.signOut();
          router.push('/login?error=email-exists');
          return;
        }

        await supabase.from('users').upsert(
          {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name ?? session.user.email,
            avatar_url: session.user.user_metadata?.avatar_url ?? null,
            role: userData?.role ?? 'user',
          },
          { onConflict: 'id' },
        );

        setStatus('Login berhasil, mengalihkan...');
        router.push(getRedirectByRole(userData?.role ?? 'user'));
      } catch {
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
