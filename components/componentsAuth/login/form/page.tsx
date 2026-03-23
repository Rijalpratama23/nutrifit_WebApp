'use client';

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function Form() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Logika validasi dipindahkan ke dalam handleSubmit agar tidak error saat render
    if (!email || !password) {
      alert('Harap isi semua kolom!');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(`login gagal : ${error.message}`);
    } else {
      alert('login berhasil');
      router.push('/user/dashboardUser');
      router.refresh();
    }
    setLoading(false);
  };

  // Bagian return HARUS di dalam fungsi Form()
  return (
    <div className="w-90 shadw-xl m-5 p-5">
      <div className="mb-4">
        <Image src="/Logo.png" alt="picture" width={200} height={100} />
      </div>
      <div className="ml-1">
        <h2 className="font-semibold text-lg">Selamat Datang!</h2>
        <p className="text-sm">Silahkan masuk untuk mengakses fitur</p>
      </div>
      <div className="flex items-center ml-1 mt-8">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="email mb-4">
            <label htmlFor="email" className="font-semibold text-lg">
              Email
            </label>
            <div>
              <input type="email" placeholder="example@gmail.com" required value={email} onChange={async (e) => setEmail(e.target.value)} className="py-2 px-2 w-full outline-1 outline-gray-400 rounded-lg" />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="font-semibold text-lg">
              Password
            </label>
            <div className="relative flex items-center">
              <input type={showPassword ? 'text' : 'password'} placeholder="*****" required value={password} onChange={(e) => setPassword(e.target.value)} className="py-2 px-2 w-full outline-1 outline-gray-400 rounded-lg" />
              <div onClick={() => setShowPassword(!showPassword)} className="absolute right-3 cursor-pointer text-gray-500 hover:text-gray-700">
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
            </div>
          </div>
          <div className="flex justify-between mb-3">
            <input type="checkbox" className="cursor-pointer" />
            <Link href="/">
              <p className="text-sm text-primary">Lupa kata sandi?</p>
            </Link>
          </div>
          <div className="mb-3">
            <button
              type="submit"
              disabled={loading} // Bagus untuk mencegah double submit
              className="bg-primary w-full cursor-pointer py-2 text-white font-semibold rounded-lg"
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </div>
          <div>
            <button type="button" className="flex cursor-pointer w-full gap-3 justify-center items-center outline-1 py-2 px-8 font-semibold rounded-lg">
              <Image src="/authimg/google.png" alt="picture" width={20} height={20} />
              <p>Masuk dengan google</p>
            </button>
          </div>
          <div className="flex justify-center mt-3">
            <p className="text-sm">
              Belum punya akun?{' '}
              <Link href="/register">
                <span className="text-primary text-sm">Daftar disini</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
