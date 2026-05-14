'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
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

export function useLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-isi email jika sebelumnya centang "ingat saya"
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error || !data.user) {
      setErrorMsg('Email atau password salah.');
      setLoading(false);
      return;
    }

    // Simpan atau hapus email dari localStorage
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', formData.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    const { data: userData, error: roleError } = await supabase.from('users').select('role').eq('email', data.user.email).single();

    if (roleError || !userData) {
      showErrorToast({ title: 'Login Gagal', message: 'Email atau password salah.' });
      setErrorMsg('Gagal mengambil data pengguna.');
      setLoading(false);
      return;
    }

    showSuccessToast({ title: 'Login Berhasil!', message: 'Selamat datang kembali 👋' })
    router.push(getRedirectByRole(userData.role));
    setLoading(false);
  };

  return { formData, rememberMe, setRememberMe, loading, errorMsg, handleChange, handleLogin };
}
