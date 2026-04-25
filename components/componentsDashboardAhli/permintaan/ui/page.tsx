'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { Bell, User } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

type Permintaan = {
  id: number;
  user: string;
  tujuan: string;
  waktu: string;
};

const dummyData: Permintaan[] = [
  { id: 1, user: 'Dadan Sugandi', tujuan: 'Menaikan berat badan', waktu: '10-03-06 | 10:00' },
  { id: 2, user: 'Dadan Sugandi', tujuan: 'Menaikan berat badan', waktu: '10-03-06 | 10:00' },
  { id: 3, user: 'Dadan Sugandi', tujuan: 'Menaikan berat badan', waktu: '10-03-06 | 10:00' },
  { id: 4, user: 'Dadan Sugandi', tujuan: 'Menaikan berat badan', waktu: '10-03-06 | 10:00' },
  { id: 5, user: 'Dadan Sugandi', tujuan: 'Menaikan berat badan', waktu: '10-03-06 | 10:00' },
  { id: 6, user: 'Dadan Sugandi', tujuan: 'Menaikan berat badan', waktu: '10-03-06 | 10:00' },
  { id: 7, user: 'Dadan Sugandi', tujuan: 'Menaikan berat badan', waktu: '10-03-06 | 10:00' },
  { id: 8, user: 'Dadan Sugandi', tujuan: 'Menaikan berat badan', waktu: '10-03-06 | 10:00' },
  { id: 9, user: 'Dadan Sugandi', tujuan: 'Menaikan berat badan', waktu: '10-03-06 | 10:00' },
];

export default function ContainerPermintaan() {
  const { isCollapsed, isMobile } = useSidebar();
  const [data, setData] = useState<Permintaan[]>(dummyData);

  const handleApprove = (id: number) => {
    alert(`Permintaan #${id} disetujui`);
  };

  const handleReject = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={`flex-1 min-h-screen transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        {/* header ccomponent */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Permintaan Konsultasi Terbaru</h1>
            <p className="text-slate-500 text-sm">Kelola permintaan user disini</p>
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

        {/* tabel */}
        <div className="bg-white rounded-2xl shadow-md w-full max-w-3xl overflow-hidden">
          {/* Header */}
          <div className="px-7 pt-6 pb-3">
            <h2 className="text-[15px] font-semibold text-gray-800 tracking-wide">Permintaan Konsultasi&nbsp;&nbsp;Terbaru</h2>
          </div>

          {/* Blue Divider */}
          <div className="h-[2.5px] w-full bg-blue-800" />

          {/* Fixed Header Table */}
          <table className="w-full text-[13.5px] text-center table-fixed ">
            <table className="w-full table-fixed text-[13.5px]">
              <thead>
                <tr>
                  <th className="w-[30%] py-3 text-left pl-6 text-gray-500 font-semibold">User</th>
                  <th className="w-[30%] py-3 text-left text-gray-500 font-semibold">Tujuan</th>
                  <th className="w-[25%] py-3 text-left text-gray-500 font-semibold">Waktu</th>
                  <th className="w-[15%] py-3 text-center text-gray-500 font-semibold">Aksi</th>
                </tr>
              </thead>
            </table>
          </table>

          {/* Scrollable tbody — aktif scroll setelah 6 baris (~300px) */}
          <div className={`overflow-y-auto ${data.length > 6 ? 'max-h-[300px]' : ''}`}>
            <table className="w-full text-[13.5px]">
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-blue-50 transition-colors duration-150">
                    {/* User */}
                    <td className="px-7 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="8" r="4" fill="#9e9e9e" />
                            <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <span className="text-gray-800 font-medium">{item.user}</span>
                      </div>
                    </td>

                    {/* Tujuan */}
                    <td className="px-4 py-3.5 text-gray-600">{item.tujuan}</td>

                    {/* Waktu */}
                    <td className="px-4 py-3.5 text-gray-500">{item.waktu}</td>

                    {/* Aksi */}
                    <td className="px-7 py-3.5">
                      <div className="flex items-center gap-2">
                        {/* Approve */}
                        <button onClick={() => handleApprove(item.id)} title="Setujui" className="w-[26px] h-[26px] rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-green-50 transition-colors">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>

                        {/* Reject */}
                        <button onClick={() => handleReject(item.id)} title="Tolak" className="w-[26px] h-[26px] rounded-full border-2 border-red-500 flex items-center justify-center hover:bg-red-50 transition-colors">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                            <path d="M6 6l12 12M18 6L6 18" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {data.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-gray-400">
                      Tidak ada permintaan konsultasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}
