'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { Bell, User } from 'lucide-react';
import Link from 'next/link';

export default function ContainerJadwal() {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div className={`flex-2 min-h-screen transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        {/* header */}
        <div className="flex justify-between items-center mb-8">
          <div className="md:mt-0 mt-10">
            <h1 className="text-2xl font-bold text-slate-800">Jadwal Konsultasi</h1>
            <p className="text-slate-500 text-sm">Lihat jadwal yang tersedia</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative p-2.5 bg-white rounded-full shadow-sm border border-slate-100 cursor-pointer">
              <Bell size={20} className="text-slate-600" />
              <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
            </div>

            {/* link ke hal profile */}
            <Link href="/ahli/profile">
              <div className="flex items-center cursor-pointer gap-3 bg-primary text-white pr-6 pl-1.5 py-1.5 rounded-full shadow-lg">
                <div className="bg-white p-2 rounded-full text-primary">
                  <User size={18} fill="currentColor" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none">Ahli</span>
                  <span className="text-[10px] opacity-80 font-medium">ahli@gmail.com</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
