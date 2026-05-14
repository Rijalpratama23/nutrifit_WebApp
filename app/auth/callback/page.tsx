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
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        setStatus('Login gagal, mengalihkan...');
        setTimeout(() => router.push('/login?error=auth-failed'), 1500);
        return;
      }

      // Query role dari tabel users
      const { data: userData } = await supabase.from('users').select('role').eq('email', session.user.email).single();

      const role = userData?.role ?? 'user';
      setStatus(`Login berhasil sebagai ${role}, mengalihkan...`);
      router.push(getRedirectByRole(role));
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      <p className="text-gray-600 text-sm">{status}</p>
    </div>
  ); 
}
