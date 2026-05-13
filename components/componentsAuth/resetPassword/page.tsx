'use client';
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';
import { toast } from 'react-hot-toast';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
 

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error('Password tidak cocok!');
      return;
    }

    if (password.length < 6) {
      toast.error('Password minimal 6 karakter!');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      showErrorToast({ title: 'Gagal', message: 'Gagal mengirim email reset.' });
    } else {
      showSuccessToast({ title: 'Password Diubah!', message: 'Silahkan login dengan password baru.' });
      setTimeout(() => router.push('/login'), 1500);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-center md:justify-start">
        <Image src="/Logo.png" alt="logo" width={150} height={60} />
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800">Reset Password</h2>
        <p className="text-gray-500 text-sm mt-1">Masukkan password baru kamu.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="font-semibold text-gray-700">Password Baru</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="******"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 py-2 px-3 w-full border rounded-lg outline-none focus:border-blue-500"
            />
            <div onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer text-gray-500">
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-700">Konfirmasi Password</label>
          <input type="password" placeholder="******" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 py-2 px-3 w-full border rounded-lg outline-none focus:border-blue-500" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 cursor-pointer">
          {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
        </button>
      </form>
    </div>
  );
}
