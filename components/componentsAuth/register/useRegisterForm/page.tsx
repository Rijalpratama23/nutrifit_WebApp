import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';
import { useRouter } from 'next/navigation';

export function useRegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.fullName },
      },
    });

    if (error) {
      showErrorToast({ title: 'Registrasi Gagal', message: error.message }); // ← pesan error asli
      setErrorMsg(error.message);
      setLoading(false); // ← loading berhenti saat error
      return;
    }

    showSuccessToast({
      title: 'Registrasi Berhasil!',
      message: 'Akun berhasil dibuat, silahkan login.', // ← pesan yang benar
    });
    setLoading(false); // ← loading berhenti saat sukses
    router.push('/login');
  };

  return { formData, loading, errorMsg, handleChange, handleRegister };
}
