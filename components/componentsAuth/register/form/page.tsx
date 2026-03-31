'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRegisterForm } from '../useRegisterForm/page';

export default function FormRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const { formData, loading, errorMsg, handleChange, handleRegister } = useRegisterForm();

  return (
    <div className="w-full p-4 md:p-0">
      {' '}
      <div className="flex items-center justify-center md:justify-start gap-2 mb-8">
        <Image src="/Logo.png" alt="Logo" width={180} height={80} />
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Selamat Datang!</h2>
        <p className="text-gray-500 text-sm">Silahkan daftar untuk mengakses fitur</p>
      </div>
      <form onSubmit={handleRegister} className="space-y-4">
        {errorMsg && <p className="text-xs text-red-500 italic">*{errorMsg}</p>}

        <div className="flex flex-col">
          <label className="font-bold text-gray-700 mb-1">Nama</label>
          <input
            name="fullName"
            type="text"
            placeholder="jhondoe"
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
            placeholder="example@gmail.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="py-2.5 px-4 w-full border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-all placeholder:text-gray-300"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="******"
              required
              value={formData.password}
              onChange={handleChange}
              className="py-2.5 px-4 w-full border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-all placeholder:text-gray-300"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={loading} className="bg-primary cursor-pointer hover:bg-blue-700 w-full py-3 text-white font-bold rounded-xl shadow-md transition-all">
            {loading ? 'Memproses..' : 'Daftar'}
          </button>
        </div>

        <p className='text-center'>Kembali ke halaman <Link href='/login'><span className='text-primary cursor-pointer'>login</span></Link></p>
      </form>
    </div>
  );
}
