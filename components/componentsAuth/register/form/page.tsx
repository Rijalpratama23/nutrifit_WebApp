'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRegisterForm } from '../useRegisterForm/page';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import { showErrorToast } from '@/components/customeToast/CustomeToast';

export default function FormRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { formData, loading, errorMsg, handleChange, handleRegister } = useRegisterForm();

  const handleLoginGoogle = async () => {
    setGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setGoogleLoading(false);
      showErrorToast({ title: 'Login Google Gagal', message: error.message });
    }
    // Tidak perlu setGoogleLoading(false) jika sukses karena akan redirect
  };

  return (
    <div className="w-full p-4 md:p-6 md:max-h-screen md:overflow-y-auto">
      <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
        <Image src="/Logo.png" alt="Logo" width={120} height={50} />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Selamat Datang!</h2>
        <p className="text-gray-500 text-xs">Silahkan daftar untuk mengakses fitur</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-3">
        {/* ── Error Message ── */}
        {errorMsg && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600">{errorMsg}</p>
          </div>
        )}

        <div className="flex flex-col">
          <label className="font-bold text-gray-700 mb-1">Nama</label>
          <input
            name="fullName"
            type="text"
            placeholder="Nama Lengkap"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="py-2.5 px-4 w-full border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-all placeholder:text-gray-300"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            suppressHydrationWarning
            placeholder="example@gmail.com"
            required
            value={formData.email}
            onChange={handleChange}
            className={`py-2.5 px-4 w-full border rounded-lg outline-none focus:border-blue-500 transition-all placeholder:text-gray-300 ${errorMsg?.includes('Email') ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimal 6 karakter"
              suppressHydrationWarning
              required
              value={formData.password}
              onChange={handleChange}
              className="py-2.5 px-4 w-full border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-all placeholder:text-gray-300"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Password minimal 6 karakter</p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="bg-primary cursor-pointer hover:bg-blue-700 w-full py-3 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400">atau</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        {/* Google */}
        <button
          onClick={handleLoginGoogle}
          type="button"
          disabled={googleLoading || loading}
          className="flex w-full gap-3 justify-center items-center border border-gray-300 py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {googleLoading ? (
            <span className="text-sm">Memproses...</span>
          ) : (
            <>
              <Image src="/authimg/google.png" alt="google" width={20} height={20} />
              <span className="text-sm">Daftar dengan Google</span>
            </>
          )}
        </button>

        {/* Info Google */}
        <p className="text-[11px] text-gray-400 text-center">Mendaftar dengan Google akan membuat akun baru jika email belum terdaftar</p>

        <p className="text-center text-sm">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Login di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
