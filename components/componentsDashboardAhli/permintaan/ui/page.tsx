'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { useState } from 'react';
import HeaderPermin from './header/page';
import HeadT from './headT/page';
import Hr from './hr/page';


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

// Lebar kolom — sama persis di thead & tbody agar sejajar
const COL = {
  user: 'w-[30%] px-6 py-3',
  tujuan: 'w-[30%] px-4 py-3',
  waktu: 'w-[25%] px-4 py-3',
  aksi: 'w-[15%] px-6 py-3',
};

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
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        <HeaderPermin />
        <div className="bg-white rounded-2xl shadow-md w-full overflow-hidden">
          <HeadT />
          <Hr />

          <div className="hidden md:block">
            {/* thead — fixed */}
            <table className="w-full text-[13.5px] table-fixed">
              <thead>
                <tr>
                  <th className={`text-left text-gray-500 font-semibold ${COL.user}`}>User</th>
                  <th className={`text-left text-gray-500 font-semibold ${COL.tujuan}`}>Tujuan</th>
                  {/* Waktu disembunyikan di tablet kecil, muncul di lg */}
                  <th className={`hidden lg:table-cell text-left text-gray-500 font-semibold ${COL.waktu}`}>Waktu</th>
                  <th className={`text-center text-gray-500 font-semibold ${COL.aksi}`}>Aksi</th>
                </tr>
              </thead>
            </table>

            {/* tbody scroll */}
            <div className="max-h-[372px] overflow-y-auto">
              <table className="w-full text-[13.5px] table-fixed">
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-400 text-sm">
                        Tidak ada permintaan konsultasi.
                      </td>
                    </tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100 hover:bg-blue-50 transition-colors duration-150">
                        {/* User */}
                        <td className={COL.user}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" fill="#9e9e9e" />
                                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </div>
                            <span className="text-gray-800 font-medium truncate">{item.user}</span>
                          </div>
                        </td>

                        {/* Tujuan */}
                        <td className={`${COL.tujuan} text-gray-600`}>{item.tujuan}</td>

                        {/* Waktu — hanya lg ke atas */}
                        <td className={`hidden lg:table-cell ${COL.waktu} text-gray-500`}>{item.waktu}</td>

                        {/* Aksi */}
                        <td className={COL.aksi}>
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleApprove(item.id)} title="Setujui" className="w-[26px] h-[26px] rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-green-50 transition-colors">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                            <button onClick={() => handleReject(item.id)} title="Tolak" className="w-[26px] h-[26px] rounded-full border-2 border-red-500 flex items-center justify-center hover:bg-red-50 transition-colors">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                <path d="M6 6l12 12M18 6L6 18" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ════════════════════════════════════════
      MOBILE (di bawah md) — card list
      Tidak pakai tabel, pakai div card per item
      ════════════════════════════════════════ */}
          <div className="block md:hidden">
            {data.length === 0 ? (
              <p className="text-center py-12 text-gray-400 text-sm">Tidak ada permintaan konsultasi.</p>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
                {data.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 transition-colors">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" fill="#9e9e9e" />
                        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-800 truncate">{item.user}</p>
                      <p className="text-[12px] text-gray-500 truncate">{item.tujuan}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.waktu}</p>
                    </div>

                    {/* Aksi — stacked vertikal di mobile */}
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button onClick={() => handleApprove(item.id)} title="Setujui" className="w-7 h-7 rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-green-50 transition-colors">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button onClick={() => handleReject(item.id)} title="Tolak" className="w-7 h-7 rounded-full border-2 border-red-500 flex items-center justify-center hover:bg-red-50 transition-colors">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <path d="M6 6l12 12M18 6L6 18" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
