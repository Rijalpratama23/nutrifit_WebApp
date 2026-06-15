'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Loader, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useLoginForm } from '../useFromLogin/page';
import { supabase } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import { showErrorToast } from '@/components/customeToast/CustomeToast';

const ERROR_MESSAGES: Record<string, string> = {
  'auth-failed': 'Login gagal. Silakan coba lagi.',
  'email-exists': 'Email ini sudah terdaftar melalui email & password. Silakan login dengan email & password, bukan Google.',
};

function UrlErrorMessage() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const urlErrorMsg = urlError ? ERROR_MESSAGES[urlError] : null;
  if (!urlErrorMsg) return null;
  return (
    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
      <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-red-600">{urlErrorMsg}</p>
    </div>
  );
}

function FormContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const { formData, loading, errorMsg, handleChange, handleLogin, rememberMe, setRememberMe } = useLoginForm();

  const handleLoginGoogle = async () => {
    setLoadingGoogle(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://nutrifit-web-app-opal.vercel.app/auth/callback' },
    });
    if (error) {
      setLoadingGoogle(false);
      showErrorToast({ title: 'Login Gagal', message: error.message });
    }
  };

  return (
    <div className="flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl">
        <div className="mb-4 flex justify-center md:justify-start">
          <Image src="/Logo.png" alt="logo" width={180} height={80} />
        </div>
        <div className="text-center md:text-left mb-6">
          <h2 className="font-semibold text-xl text-gray-800">Selamat Datang!</h2>
          <p className="text-sm text-gray-600">Silahkan masuk untuk mengakses fitur</p>
        </div>

        <Suspense fallback={null}>
          <UrlErrorMessage />
        </Suspense>

        {errorMsg && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full">
          <div className="mb-4">
            <label className="font-semibold text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              suppressHydrationWarning
              placeholder="example@gmail.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 py-2 px-3 w-full border rounded-lg outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="*****"
                suppressHydrationWarning
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 py-2 px-3 w-full border rounded-lg outline-none focus:border-blue-500"
              />
              <div onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer text-gray-500">
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4 text-sm">
            <label className="flex items-center gap-1 text-gray-600 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Ingat saya
            </label>
            <Link href="/forgot-password" className="text-primary hover:underline">
              Lupa kata sandi?
            </Link>
          </div>
          <button type="submit" disabled={loading || loadingGoogle} className="bg-primary hover:bg-opacity-90 w-full py-2 text-white font-semibold rounded-lg mb-3 disabled:bg-gray-400 hover:bg-blue-500 cursor-pointer">
            {loading ? 'Memproses...' : 'Login'}
          </button>
          <div className="flex items-center gap-3 my-3">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400">atau</span>
            <hr className="flex-1 border-gray-200" />
          </div>
          <button
            onClick={handleLoginGoogle}
            type="button"
            disabled={loadingGoogle || loading}
            className="flex w-full gap-3 justify-center items-center border py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer disabled:bg-gray-100 disabled:opacity-60"
          >
            {loadingGoogle ? (
              <>
                <Loader size={20} className="animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Image src="/authimg/google.png" alt="google" width={20} height={20} />
                Masuk dengan Google
              </>
            )}
          </button>
          <div className="text-center mt-4 text-sm">
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Daftar disini
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Form() {
  return <FormContent />;
}
