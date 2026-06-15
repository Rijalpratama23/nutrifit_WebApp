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
        // Biarkan Supabase handle otomatis dari URL
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          // Tunggu sebentar lalu coba lagi
          setTimeout(async () => {
            const {
              data: { session: retrySession },
            } = await supabase.auth.getSession();
            if (!retrySession) {
              router.push('/login?error=no-session');
              return;
            }
            await handleSession(retrySession);
          }, 1000);
          return;
        }

        await handleSession(session);
      } catch {
        router.push('/login?error=unknown');
      }
    };

    const handleSession = async (session: any) => {
      const { data: userData } = await supabase
        .from('users')
        .select('id, role')
        .eq('email', session.user.email ?? '')
        .single();

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

      router.push(getRedirectByRole(userData?.role ?? 'user'));
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
