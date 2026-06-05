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
        setStatus('Login gagal, mengalihkan...');
        setTimeout(() => router.push('/login?error=auth-failed'), 1500);
        return;
      }

      const user = session.user;

      // ── Cek apakah login via Google ──────────────────────────────────────
      const isGoogleLogin = user.app_metadata?.provider === 'google' ||
        user.identities?.some((id: any) => id.provider === 'google');

      if (isGoogleLogin) {
        // Cek apakah email ini sudah punya akun email+password
        // Caranya: cek apakah user punya identity 'email' JUGA selain 'google'
        const hasEmailIdentity = user.identities?.some(
          (id: any) => id.provider === 'email'
        );
        const hasGoogleIdentity = user.identities?.some(
          (id: any) => id.provider === 'google'
        );

        // Jika punya KEDUA identity (email + google) — ini akun yang merge
        // Kita cek apakah akun ini awalnya dibuat via email (bukan via Google)
        if (hasEmailIdentity && hasGoogleIdentity) {
          // Cek di tabel users apakah akun ini sudah ada sebelum Google login
          const { data: existingUser } = await supabase
            .from('users')
            .select('id, role')
            .eq('id', user.id)
            .single();

          // Akun sudah ada — lanjutkan login normal (ini bukan duplikat baru)
          if (existingUser) {
            const role = existingUser.role ?? 'user';
            setStatus(`Login berhasil, mengalihkan...`);
            router.push(getRedirectByRole(role));
            return;
          }
        }

        // Cek apakah email Google sudah terdaftar di tabel users dengan ID berbeda
        const { data: existingByEmail } = await supabase
          .from('users')
          .select('id, role')
          .eq('email', user.email ?? '')
          .single();

        if (existingByEmail && existingByEmail.id !== user.id) {
          // Email sudah terdaftar dengan akun berbeda — tolak & logout
          setStatus('Email sudah terdaftar, mengalihkan...');
          await supabase.auth.signOut();
          setTimeout(() => {
            router.push('/login?error=email-exists');
          }, 1000);
          return;
        }
      }

      // ── Ambil role & redirect ─────────────────────────────────────────────
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      const role = userData?.role ?? 'user';
      setStatus(`Login berhasil, mengalihkan...`);
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