'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

function getRedirectByRole(role: string): string {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'ahli':  return '/ahli/home';
    default:      return '/user/dashboardUser';
  }
}

export default function CallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Memproses login...');

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        if (error?.message.includes('already')) {
          router.push('/login?error=email-exist');
        } else {
          router.push('/login?error=auth-failed');
        }
        return;
      }

      const user = session.user;

      const isGoogleLogin = user.app_metadata?.provider === 'google' ||
        user.identities?.some((id: any) => id.provider === 'google');

      if (isGoogleLogin) {
        const hasEmailIdentity = user.identities?.some(
          (id: any) => id.provider === 'email'
        );
        const hasGoogleIdentity = user.identities?.some(
          (id: any) => id.provider === 'google'
        );

        if (hasEmailIdentity && hasGoogleIdentity) {
          const { data: existingUser } = await supabase
            .from('users')
            .select('id, role')
            .eq('id', user.id)
            .single();

          if (existingUser) {
            const role = existingUser.role ?? 'user';
            setStatus('Login berhasil, mengalihkan...');
            router.push(getRedirectByRole(role));
            return;
          }
        }

        const { data: existingByEmail } = await supabase
          .from('users')
          .select('id, role')
          .eq('email', user.email ?? '')
          .single();

        if (existingByEmail && existingByEmail.id !== user.id) {
          setStatus('Email sudah terdaftar, mengalihkan...');
          await supabase.auth.signOut();
          setTimeout(() => {
            router.push('/login?error=email-exists');
          }, 1000);
          return;
        }
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      const role = userData?.role ?? 'user';
      setStatus('Login berhasil, mengalihkan...');
      router.push(getRedirectByRole(role));
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