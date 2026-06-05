'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const source = searchParams.get('source') || 'login'; // default ke 'login'
  const [status, setStatus] = useState('Memproses...');

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
      const isGoogleLogin = user.app_metadata?.provider === 'google' || user.identities?.some((id: { provider: string }) => id.provider === 'google');

      // ─── LOGIC UNTUK REGISTER PAGE ─────────────────────────────────────────
      if (source === 'register') {
        if (isGoogleLogin) {
          const hasEmailIdentity = user.identities?.some((id: { provider: string }) => id.provider === 'email');

          if (hasEmailIdentity) {
            // Akun ini awalnya dibuat via email+password → TOLAK
            setStatus('Akun ini terdaftar via email. Mengalihkan...');
            await supabase.auth.signOut();
            showErrorToast({
              title: 'Login Ditolak',
              message: 'Akun ini sudah terdaftar dengan email & password. Silakan login menggunakan email & password.',
            });
            setTimeout(() => {
              router.push('/register?error=email-exists');
            }, 1800);
            return;
          }

          // ── Cek apakah email sudah ada di table users (akun Google sebelumnya) ──
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email?.toLowerCase().trim() || '')
            .maybeSingle();

          if (existingUser) {
            // Email sudah ada (user pernah Google OAuth) → TOLAK
            setStatus('Email sudah terdaftar. Mengalihkan...');
            await supabase.auth.signOut();
            showErrorToast({
              title: 'Registrasi Gagal',
              message: 'Email ini sudah terdaftar. Silakan gunakan email lain atau login.',
            });
            setTimeout(() => {
              router.push('/register?error=email-exists');
            }, 1800);
            return;
          }

          // ── Email baru → CREATE akun baru sebagai 'user' ──
          const { error: insertError } = await supabase.from('users').insert({
            id: user.id,
            email: user.email?.toLowerCase().trim() || '',
            full_name: user.user_metadata?.full_name || 'User',
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          if (insertError) {
            console.error('Insert user error:', insertError);
            setStatus('Gagal membuat akun. Mengalihkan...');
            await supabase.auth.signOut();
            showErrorToast({
              title: 'Registrasi Gagal',
              message: 'Terjadi kesalahan saat membuat akun.',
            });
            setTimeout(() => {
              router.push('/register?error=create-failed');
            }, 1800);
            return;
          }

          setStatus('Registrasi berhasil, mengalihkan...');
          showSuccessToast({ title: 'Registrasi Berhasil!', message: 'Akun berhasil dibuat 🎉' });
          setTimeout(() => {
            router.push('/user/dashboardUser');
          }, 500);
          return;
        }
      }

      // ─── LOGIC UNTUK LOGIN PAGE ────────────────────────────────────────────
      if (source === 'login') {
        if (isGoogleLogin) {
          // ── Cek apakah user sudah ada di database ──
          const { data: existingUser } = await supabase.from('users').select('role, id').eq('id', user.id).maybeSingle();

          if (existingUser) {
            // User sudah ada → LOGIN sesuai role
            const role = existingUser.role || 'user';
            setStatus('Login berhasil, mengalihkan...');
            showSuccessToast({ title: 'Login Berhasil!', message: 'Selamat datang kembali 👋' });

            setTimeout(() => {
              router.push(getRedirectByRole(role));
            }, 500);
            return;
          }

          // ── User baru (email belum ada) → CREATE akun baru sebagai 'user' ──
          const { error: insertError } = await supabase.from('users').insert({
            id: user.id,
            email: user.email?.toLowerCase().trim() || '',
            full_name: user.user_metadata?.full_name || 'User',
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          if (insertError) {
            console.error('Insert user error:', insertError);
            setStatus('Gagal membuat akun. Mengalihkan...');
            await supabase.auth.signOut();
            showErrorToast({
              title: 'Login Gagal',
              message: 'Terjadi kesalahan saat membuat akun.',
            });
            setTimeout(() => {
              router.push('/login?error=create-failed');
            }, 1800);
            return;
          }

          // Login baru dengan auto-create akun
          setStatus('Akun baru dibuat, mengalihkan...');
          showSuccessToast({ title: 'Login Berhasil!', message: 'Akun baru telah dibuat 🎉' });

          setTimeout(() => {
            router.push('/user/dashboardUser');
          }, 500);
          return;
        }
      }

      // ── Default: Ambil role & redirect (untuk email+password login) ─────────
      const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).maybeSingle();

      const role = userData?.role ?? 'user';
      setStatus('Login berhasil, mengalihkan...');
      showSuccessToast({ title: 'Login Berhasil!', message: 'Selamat datang kembali 👋' });

      setTimeout(() => {
        router.push(getRedirectByRole(role));
      }, 500);
    };

    handleCallback();
  }, [router, source]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      <p className="text-gray-600 text-sm">{status}</p>
    </div>
  );
}
