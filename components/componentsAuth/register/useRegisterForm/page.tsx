import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';
import { useRouter } from 'next/navigation';

// ─── Helper: Translate error Supabase → Bahasa Indonesia ─────────────────────

function translateError(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('user already registered') || msg.includes('already been registered')) {
    return 'Email ini sudah terdaftar. Silakan login atau gunakan email lain.';
  }
  if (msg.includes('email already in use')) {
    return 'Email ini sudah digunakan. Silakan login atau gunakan email lain.';
  }
  if (msg.includes('password should be at least')) {
    return 'Password minimal 6 karakter.';
  }
  if (msg.includes('unable to validate email address')) {
    return 'Format email tidak valid.';
  }
  if (msg.includes('signup is disabled')) {
    return 'Pendaftaran sementara dinonaktifkan.';
  }
  if (msg.includes('email rate limit exceeded')) {
    return 'Terlalu banyak percobaan. Coba lagi nanti.';
  }
  return 'Terjadi kesalahan. Silakan coba lagi.';
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error saat user mulai mengetik lagi
    if (errorMsg) setErrorMsg(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // ── Validasi dasar ──────────────────────────────────────────────────────
    if (!formData.fullName.trim()) {
      setErrorMsg('Nama lengkap tidak boleh kosong.');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      setLoading(false);
      return;
    }

    // ── Cek apakah email sudah terdaftar via OAuth Google ───────────────────
    // Supabase tidak expose ini langsung, tapi kita bisa cek di tabel users
    const { data: existingUser } = await supabase.from('users').select('id, email').eq('email', formData.email.toLowerCase().trim()).maybeSingle();

    if (existingUser) {
      const errorText = 'Email ini sudah terdaftar. Silakan login atau gunakan email lain.';
      setErrorMsg(errorText);
      showErrorToast({ title: 'Registrasi Gagal', message: errorText });
      setLoading(false);
      return;
    }

    // ── Daftar ke Supabase Auth ─────────────────────────────────────────────
    const { error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        data: { full_name: formData.fullName.trim() },
      },
    });

    if (error) {
      const translated = translateError(error.message);
      setErrorMsg(translated);
      showErrorToast({ title: 'Registrasi Gagal', message: translated });
      setLoading(false);
      return;
    }

    showSuccessToast({
      title: 'Registrasi Berhasil!',
      message: 'Akun berhasil dibuat, silakan login.',
    });
    setLoading(false);
    router.push('/login');
  };

  return { formData, loading, errorMsg, handleChange, handleRegister };
}
