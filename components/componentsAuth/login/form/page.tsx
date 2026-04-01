'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useLoginForm } from '../useFromLogin/page';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Form() {
  const [showPassword, setShowPassword] = useState(false);
  const { formData, loading, errorMsg, handleChange, handleLogin } = useLoginForm();
  const router = useRouter();

  // LOGIN LOGICAL OAUTH //
  const handleLoginGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `http://localhost:3000/user/dashboardUser`,

      },
    });
    if (error) {
      toast.error(`login galgal ${error.message}`)
      return;
    } else {
      router.push('/user/dashboardUser');
      router.refresh();
    }
  };

    // KOMPONEN UI //
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

        {errorMsg && <p className="text-red-500 text-xs mb-4 italic">*{errorMsg}</p>}

        <form onSubmit={handleLogin} className="w-full">
          <div className="mb-4">
            <label className="font-semibold text-gray-700">Email</label>
            <input name="email" type="email" placeholder="example@gmail.com" required value={formData.email} onChange={handleChange} className="mt-1 py-2 px-3 w-full border rounded-lg outline-none focus:border-blue-500" />
          </div>

          <div className="mb-4">
            <label className="font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="*****"
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
            <label className="flex items-center gap-1 text-gray-600">
              <input type="checkbox" /> Ingat saya
            </label>
            <Link href="/" className="text-primary hover:underline">
              Lupa kata sandi?
            </Link>
          </div>

          {/* Tombol Login */}
          <button type="submit" disabled={loading} className="bg-primary hover:bg-opacity-90 w-full py-2 text-white font-semibold rounded-lg mb-3 disabled:bg-gray-400 hover:bg-blue-500 cursor-pointer">
            {loading ? 'Memproses...' : 'Login'}
          </button>

          <button onClick={handleLoginGoogle} type="button" className="flex w-full gap-3 justify-center items-center border py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
            <Image src="/authimg/google.png" alt="google" width={20} height={20} />
            Masuk dengan google
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
