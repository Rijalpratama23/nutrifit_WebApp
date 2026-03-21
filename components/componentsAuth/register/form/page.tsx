'use client'; // Wajib ditambahkan di Next.js App Router untuk interaktivitas

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/client';
import { Eye, EyeOff } from 'lucide-react';
import router from 'next/navigation';

export default function FormRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password || !fullName) {
      alert('Harap isi semua kolom!');
      setLoading(false);
      return;
    }
    // pemanggilan fungsi signUp di supabase
    const { data, error } = await supabase.auth.signUp({
      email:email,
      password:password,
      options: {
        data: {
          fullName,
        }
      }
    })

    if (error) {
      alert(`Gagal Daftar: ${error.message}`);
    }else {
      alert(`Pendaftaran berhasil! silahkan cek email untuk konfirmasi (jika aktif) atau langsung login`)
      router.push('/login')
    }

    setLoading(false)
  };

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
          <div className="namae mb-4">
            <label htmlFor="name" className="font-semibold text-lg">
              Nama
            </label>
            <div>
              <input
                type="text"
                placeholder="jhondoe"
                required 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="py-2 px-2 w-full outline-1 outline-gray-400 rounded-lg"
              />
            </div>
          </div>
          <div className="email mb-4">
            <label htmlFor="email" className="font-semibold text-lg">
              Email
            </label>
            <div>
              <input
                type="email"
                placeholder="example@gmail.com"
                required // Validasi HTML5
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-2 px-2 w-full outline-1 outline-gray-400 rounded-lg"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="font-semibold text-lg">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'} // Interaktivitas Tipe Input
                placeholder="*****"
                required // Validasi HTML5
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-2 px-2 w-full outline-1 outline-gray-400 rounded-lg"
              />
              {/* Tombol Mata Interaktif */}
              <div onClick={() => setShowPassword(!showPassword)} className="absolute right-3 cursor-pointer text-gray-500 hover:text-gray-700">
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
            </div>
          </div>
          <div className="flex justify-between mb-3">
            <input type="checkbox" className="cursor-pointer" />
          </div>
          <div className="mb-3">
            <button type="submit" className="bg-primary w-full cursor-pointer py-2 text-white font-semibold rounded-lg">
              {loading? 'Memproses..' : 'Daftar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
