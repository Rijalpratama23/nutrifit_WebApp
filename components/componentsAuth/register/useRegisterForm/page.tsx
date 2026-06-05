import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';
import { useRouter } from 'next/navigation';

// ─── Helper: Validasi Password ────────────────────────────────────────────────

function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return 'Password minimal 6 karakter.';
  }
  if (!/[A-Z]/.test(password) && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password harus mengandung minimal 1 huruf kapital atau karakter khusus (!@#$%^&*).';
  }
  return null;
}

// ─── Helper: Translate error Supabase → Bahasa Indonesia ─────────────────────

function translateError(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes('user already registered') || msg.includes('already been registered') || msg.includes('already registered')) {
    return 'Email ini sudah terdaftar. Silakan gunakan email lain atau login.';
  }
  if (msg.includes('email already in use')) {
    return 'Email ini sudah digunakan. Silakan gunakan email lain.';
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
    if (errorMsg) setErrorMsg(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // ── Validasi nama ────────────────────────────────────────────────────────
    if (!formData.fullName.trim()) {
      setErrorMsg('Nama lengkap tidak boleh kosong.');
      setLoading(false);
      return;
    }

    // ── Validasi password ────────────────────────────────────────────────────
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrorMsg(passwordError);
      showErrorToast({ title: 'Password Tidak Valid', message: passwordError });
      setLoading(false);
      return;
    }

    // ── Cek email sudah terdaftar di tabel users ─────────────────────────────
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', formData.email.toLowerCase().trim())
      .maybeSingle();

    if (existingUser) {
      const msg = 'Email ini sudah terdaftar. Silakan gunakan email lain atau login.';
      setErrorMsg(msg);
      showErrorToast({ title: 'Email Sudah Terdaftar', message: msg });
      // ✅ TIDAK redirect — user tetap di halaman register untuk ganti email
      setLoading(false);
      return;
    }

    // ── Daftar ke Supabase Auth ──────────────────────────────────────────────
    const { data, error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: { data: { full_name: formData.fullName.trim() } },
    });

    if (error) {
      const translated = translateError(error.message);
      setErrorMsg(translated);
      showErrorToast({ title: 'Registrasi Gagal', message: translated });
      setLoading(false);
      return;
    }

    // ── Cek duplikat dari Supabase (identities kosong = email sudah ada) ─────
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      const msg = 'Email ini sudah terdaftar. Silakan gunakan email lain atau login.';
      setErrorMsg(msg);
      showErrorToast({ title: 'Email Sudah Terdaftar', message: msg });
      setLoading(false);
      return;
    }

    showSuccessToast({ title: 'Registrasi Berhasil!', message: 'Akun berhasil dibuat, silakan login.' });
    setLoading(false);
    router.push('/login');
  };

  return { formData, loading, errorMsg, handleChange, handleRegister };
}