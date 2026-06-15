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
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          router.push('/login?error=auth-failed');
          return;
        }

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

        setStatus('Login berhasil, mengalihkan...');
        router.push(getRedirectByRole(userData?.role ?? 'user'));
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
