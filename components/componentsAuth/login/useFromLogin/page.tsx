'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';

// ─── Helper: Redirect by role ─────────────────────────────────────────────────

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

// ─── Helper: Translate error Supabase → Bahasa Indonesia ─────────────────────

function translateLoginError(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'Email atau password salah.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Email belum dikonfirmasi. Periksa kotak masuk email Anda.';
  }
  if (msg.includes('too many requests') || msg.includes('rate limit')) {
    return 'Terlalu banyak percobaan login. Coba lagi beberapa menit.';
  }
  if (msg.includes('user not found')) {
    return 'Akun dengan email ini tidak ditemukan.';
  }
  return 'Login gagal. Silakan coba lagi.';
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // ── Cek apakah email terdaftar via Google OAuth ─────────────────────────
    // Jika user daftar via Google, mereka tidak punya password
    // Kita beri pesan yang lebih helpful
    const { data: userData } = await supabase.from('users').select('id').eq('email', formData.email.toLowerCase().trim()).maybeSingle();

    // ── Login dengan email + password ───────────────────────────────────────
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (error) {
      // Jika akun ada di users tapi login gagal → kemungkinan akun OAuth
      if (userData && (error.message.includes('Invalid login credentials') || error.message.includes('invalid credentials'))) {
        const msg = 'Akun ini terdaftar melalui Google. Silakan gunakan tombol "Masuk dengan Google".';
        setErrorMsg(msg);
        showErrorToast({ title: 'Login Gagal', message: msg });
      } else {
        const msg = translateLoginError(error.message);
        setErrorMsg(msg);
        showErrorToast({ title: 'Login Gagal', message: msg });
      }
      setLoading(false);
      return;
    }

    if (!data.user) {
      setErrorMsg('Login gagal. Silakan coba lagi.');
      setLoading(false);
      return;
    }

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', formData.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    const { data: userRole, error: roleError } = await supabase.from('users').select('role').eq('id', data.user.id).single();

    if (roleError || !userRole) {
      showErrorToast({ title: 'Login Gagal', message: 'Gagal mengambil data pengguna.' });
      setErrorMsg('Gagal mengambil data pengguna.');
      setLoading(false);
      return;
    }

    showSuccessToast({ title: 'Login Berhasil!', message: 'Selamat datang kembali 👋' });
    router.push(getRedirectByRole(userRole.role));
    setLoading(false);
  };

  return { formData, rememberMe, setRememberMe, loading, errorMsg, handleChange, handleLogin };
}
