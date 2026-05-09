'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Step 1: Login ke Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    console.log('=== STEP 1 AUTH ===', { user: data?.user?.id, error });

    if (error || !data.user) {
      setErrorMsg('Email atau password salah.');
      setLoading(false);
      return;
    }

    // Step 2: Ambil role dari tabel users
    const { data: userData, error: roleError } = await supabase.from('users').select('role').eq('id', data.user.id).single();

    console.log('=== STEP 2 ROLE ===', { userData, roleError });

    if (roleError || !userData) {
      setErrorMsg('Gagal mengambil data pengguna.');
      setLoading(false);
      return;
    }

    // Step 3: Redirect sesuai role
    const redirectPath = getRedirectByRole(userData.role);
    toast.success('Login berhasil!');
    router.push(redirectPath);
    setLoading(false);
  };

  return { formData, loading, errorMsg, handleChange, handleLogin };
}
