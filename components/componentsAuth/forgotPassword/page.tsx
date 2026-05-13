'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';
import { showInfoToast, showErrorToast } from '@/components/customeToast/CustomeToast';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `http://localhost:3000/reset-password`,
    });

    if (error) {
      showErrorToast({ title: 'Gagal', message: 'Gagal mengirim email reset.' });
    } else {
      setSent(true);
      showInfoToast({ title: 'Email Terkirim!', message: 'Cek inbox untuk reset password.' });
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="text-5xl">📧</div>
        <h2 className="text-xl font-bold text-gray-800">Email Terkirim!</h2>
        <p className="text-gray-500 text-sm">
          Kami telah mengirim link reset password ke <strong>{email}</strong>. Silahkan cek inbox atau folder spam kamu.
        </p>
        <Link href="/login">
          <button className="mt-4 w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-600">Kembali ke Login</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-center md:justify-start">
        <Image src="/Logo.png" alt="logo" width={150} height={60} />
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800">Lupa Kata Sandi?</h2>
        <p className="text-gray-500 text-sm mt-1">Masukkan email kamu dan kami akan mengirimkan link untuk reset password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-semibold text-gray-700">Email</label>
          <input type="email" placeholder="example@gmail.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 py-2 px-3 w-full border rounded-lg outline-none focus:border-blue-500" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 cursor-pointer">
          {loading ? 'Mengirim...' : 'Kirim Link Reset'}
        </button>
      </form>

      <p className="text-center text-sm">
        Ingat password?{' '}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Kembali login
        </Link>
      </p>
    </div>
  );
}
