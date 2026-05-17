"use client"

import { Bell, User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

export default function Header() {
  const { user, loading }= useUser();

  return (
    <div className="flex justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
      <div className="mt-8 sm:mt-0">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">Konsultasi Aktif</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Lihat &amp; kelola konsultasi aktif</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Bell */}
        <div className="relative p-2 sm:p-2.5 bg-white rounded-full shadow-sm border border-slate-100 cursor-pointer">
          <Bell size={18} className="text-slate-600" />
          <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </div>

        {/* Profile pill — ikon only on mobile, full on sm+ */}
        <Link href="/ahli/profile">
          <div className="flex items-center cursor-pointer gap-2 sm:gap-3 bg-primary text-white sm:pr-6 pr-3 pl-1.5 py-1.5 rounded-full shadow-lg">
            <div className="bg-white p-1.5 sm:p-2 rounded-full text-primary flex-shrink-0">
              <User size={15} fill="currentColor" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold leading-none">{loading ? 'Loading...' : user?.nama || 'Ahli'}</span>
              <span className="text-[10px] opacity-80 font-medium">{loading ? '...' : user?.email || 'ahli@gmail.com'}</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
