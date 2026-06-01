'use client';

import { Bell, User } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';

export default function HeaderKomponents() {
  const { user, loading } = useUser();

  return (
    <div className="flex justify-between items-center mb-6 sm:mb-8 mt-10 sm:mt-0">
      <div className="min-w-0 flex-1">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 break-words">Selamat Datang Doctor {user?.nama ? `@${user.nama}` : '@Ahli'}</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Pemberitahuan dan informasi menyeluruh</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0 ml-2 sm:ml-4">
        {/* Notifikasi */}
        <div className="relative p-1.5 sm:p-2 md:p-2.5 bg-white rounded-full shadow-sm border border-slate-100 cursor-pointer">
          <Bell size={16} className="sm:w-5 sm:h-5 md:w-5 md:h-5 text-slate-600" />
          <div className="absolute top-0 right-0 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </div>

        {/* Link ke profile */}
        <Link href="/ahli/profile">
          <div className="flex items-center cursor-pointer gap-2 sm:gap-2.5 md:gap-3 bg-primary text-white px-2 sm:px-3 md:px-6 py-1 sm:py-1.5 rounded-full shadow-lg hover:shadow-xl transition-shadow">
            {/* Avatar — foto jika ada, icon jika tidak */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
              {!loading && user?.avatar_url ? <img src={user.avatar_url} alt={user.nama} className="w-full h-full object-cover" /> : <User size={14} className="sm:w-4 sm:h-4 text-primary" fill="currentColor" />}
            </div>

            <div className="hidden sm:flex flex-col whitespace-nowrap">
              <span className="text-xs font-bold leading-none">{loading ? 'Loading...' : user?.nama || 'Ahli'}</span>
              <span className="text-[10px] opacity-80 font-medium truncate">{loading ? '...' : user?.email || 'ahli@gmail.com'}</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
