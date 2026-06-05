'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';

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
        showErrorToast({ title: 'Login Gagal', message: 'Terjadi kesalahan saat login.' });
        setTimeout(() => router.push('/login?error=auth-failed'), 1500);
        return;
      }

      const user = session.user;

      // ── Cek apakah login via Google ──────────────────────────────────────
      const isGoogleLogin = user.app_metadata?.provider === 'google' || user.identities?.some((id: any) => id.provider === 'google');

      if (isGoogleLogin) {
        // Cek apakah user ini JUGA punya identity 'email' (artinya daftar manual dulu)
        const hasEmailIdentity = user.identities?.some((id: any) => id.provider === 'email');

        if (hasEmailIdentity) {
          // Akun ini awalnya dibuat via email+password → TOLAK login Google
          setStatus('Akun ini terdaftar via email. Mengalihkan...');
          await supabase.auth.signOut();
          showErrorToast({
            title: 'Login Ditolak',
            message: 'Akun ini sudah terdaftar dengan email & password. Silakan login menggunakan email & password.',
          });
          setTimeout(() => {
            router.push('/login?error=use-email-login');
          }, 1800);
          return;
        }
      }

      // ── Ambil role & redirect ─────────────────────────────────────────────
      const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();

      const role = userData?.role ?? 'user';
      setStatus('Login berhasil, mengalihkan...');
      showSuccessToast({ title: 'Login Berhasil!', message: 'Selamat datang kembali 👋' });

      setTimeout(() => {
        router.push(getRedirectByRole(role));
      }, 500);
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      <p className="text-gray-600 text-sm">{status}</p>
    </div>
  );
}
