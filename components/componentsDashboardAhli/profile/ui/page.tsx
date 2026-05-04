'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { Settings, Pencil, LogOut, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────
interface Konsultasi {
  id: number;
  tanggal: string;
  deskripsi: string;
  ahli: string;
  status: 'Selesai' | 'Dibatalkan';
}

type TabType = 'Selesai' | 'Dibatalkan';

// ─── Dummy Data ───────────────────────────────────────────────
const KONSULTASI_DATA: Konsultasi[] = [
  { id: 1, tanggal: '24 Sep 2026', deskripsi: 'Konsultasi mengenai makanan orang diet', ahli: 'Dr. Hariyanto. Gz', status: 'Selesai' },
  { id: 2, tanggal: '10 Okt 2026', deskripsi: 'Program gizi harian untuk masa pemulihan', ahli: 'Dr. Hariyanto. Gz', status: 'Selesai' },
  { id: 3, tanggal: '02 Nov 2026', deskripsi: 'Konsultasi peningkatan berat badan sehat', ahli: 'Dr. Hariyanto. Gz', status: 'Selesai' },
  { id: 4, tanggal: '15 Nov 2026', deskripsi: 'Sesi diet mediterania dibatalkan user', ahli: 'Dr. Hariyanto. Gz', status: 'Dibatalkan' },
  { id: 5, tanggal: '20 Nov 2026', deskripsi: 'Rencana konsultasi gizi anak dibatalkan', ahli: 'Dr. Hariyanto. Gz', status: 'Dibatalkan' },
];

const PENGALAMAN = [
  { tahun: '2018 – 2022', judul: 'Ahli Gizi Klinis', tempat: 'RS Persahabatan Jakarta' },
  { tahun: '2022 – Kini', judul: 'Konsultan Gizi', tempat: 'Klinik Nutrifit' },
];

const PENDIDIKAN = [
  { tahun: '2010 – 2014', judul: 'S1 Ilmu Gizi', tempat: 'Universitas Indonesia' },
  { tahun: '2015 – 2017', judul: 'S2 Gizi Klinik', tempat: 'Universitas Gadjah Mada' },
];

export default function ContainerProfile() {
  const { isCollapsed, isMobile } = useSidebar();

  const [activeTab, setActiveTab] = useState<TabType>('Selesai');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [page, setPage] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function handleTabChange(tab: TabType) {
    setActiveTab(tab);
    setPage(0);
    setDropdownOpen(false);
  }

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const filtered = KONSULTASI_DATA.filter((k) => k.status === activeTab);
  const totalPages = filtered.length;
  const visibleItem = filtered[page] ?? null;
  const countSelesai = KONSULTASI_DATA.filter((k) => k.status === 'Selesai').length;
  const countDibatalkan = KONSULTASI_DATA.filter((k) => k.status === 'Dibatalkan').length;

  return (
    <div
      className={`
        flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300
        ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}
      `}
    >
      <div className="p-4 sm:p-6 lg:p-10">
        {/* ── Header ── */}
        <div className="flex justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
          <div className="mt-8 sm:mt-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Profile</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Kelola PRofile Anda</p>
          </div>
          <button className="flex items-center gap-2 border border-gray-300 rounded-xl py-2 px-3 sm:px-5 font-semibold text-xs sm:text-sm bg-white hover:bg-gray-50 transition-colors cursor-pointer shadow-sm flex-shrink-0">
            <Settings size={15} className="text-gray-700 flex-shrink-0" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* ── Main Grid ──
            Mobile  : 1 kolom, profile card penuh → lalu cards
            Desktop : sidebar 220px | konten flex
        ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 sm:gap-5">
          {/* ── LEFT: Profile Card ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col items-center gap-3">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center mt-2">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <circle cx="50" cy="50" r="50" fill="#e5e7eb" />
                <circle cx="50" cy="38" r="18" fill="#9ca3af" />
                <ellipse cx="50" cy="85" rx="28" ry="20" fill="#9ca3af" />
              </svg>
            </div>

            {/* Name & Email */}
            <div className="text-center">
              <p className="font-bold text-gray-800 text-sm sm:text-base">Dr. Hariyanto. Gz</p>
              <p className="text-gray-400 text-xs mt-0.5">hariyanto@gmail.com</p>
            </div>

            {/* Info rows */}
            <div className="w-full border-t border-gray-100 pt-3 space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-gray-500 font-medium">Spesialis</span>
                <span className="text-gray-800 font-semibold">Gizi</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-gray-500 font-medium">Status User</span>
                <span className="inline-flex items-center gap-1.5 text-green-600 font-semibold text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  ONLINE
                </span>
              </div>
            </div>

            {/* Logout */}
            <button className="mt-1 w-full flex items-center justify-center gap-2 border border-red-300 text-red-500 hover:bg-red-50 transition-colors rounded-xl py-2 text-sm font-medium cursor-pointer">
              <LogOut size={14} />
              Keluar
            </button>
          </div>

          {/* ── RIGHT: Content Cards ── */}
          <div className="flex flex-col gap-4 sm:gap-5 min-w-0">
            {/* Pengalaman + Pendidikan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Pengalaman Profesional */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-[15px] truncate pr-2">Pengalaman Profesional</h2>
                  <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0">
                    <Pencil size={14} className="text-blue-500" />
                  </button>
                </div>
                <div className="space-y-3">
                  {PENGALAMAN.map((item, i) => (
                    <div key={i} className="flex gap-2.5">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-400">{item.tahun}</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">{item.judul}</p>
                        <p className="text-[11px] sm:text-xs text-gray-500 truncate">{item.tempat}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pendidikan */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-[15px]">Pendidikan</h2>
                  <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0">
                    <Pencil size={14} className="text-blue-500" />
                  </button>
                </div>
                <div className="space-y-3">
                  {PENDIDIKAN.map((item, i) => (
                    <div key={i} className="flex gap-2.5">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-400">{item.tahun}</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">{item.judul}</p>
                        <p className="text-[11px] sm:text-xs text-gray-500 truncate">{item.tempat}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Konsultasi Card ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 min-w-0">
              {/* Card header */}
              <div className="flex items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {/* Dropdown trigger */}
                  <div className="relative flex-shrink-0" ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen((o) => !o)} className="flex items-center gap-1">
                      <span className={`font-semibold text-sm sm:text-[15px] border-b-2 pb-0.5 whitespace-nowrap transition-colors ${activeTab === 'Selesai' ? 'text-blue-600 border-blue-500' : 'text-red-500 border-red-400'}`}>
                        Konsultasi {activeTab}
                      </span>
                      <ChevronDown size={13} strokeWidth={2.5} className={`flex-shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''} ${activeTab === 'Selesai' ? 'text-blue-500' : 'text-red-400'}`} />
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                      <div className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 w-[190px] sm:w-[200px] flex flex-col gap-0.5">
                        <button
                          onClick={() => handleTabChange('Selesai')}
                          className={`flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm mx-1 rounded-lg transition-colors ${activeTab === 'Selesai' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                          Konsultasi Selesai
                          <span className={`ml-auto text-[10px] sm:text-[11px] rounded-full px-1.5 py-0.5 font-semibold ${activeTab === 'Selesai' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{countSelesai}</span>
                        </button>
                        <div className="mx-3 border-t border-gray-100" />
                        <button
                          onClick={() => handleTabChange('Dibatalkan')}
                          className={`flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm mx-1 rounded-lg transition-colors ${activeTab === 'Dibatalkan' ? 'bg-red-50 text-red-500 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                          Konsultasi Batal
                          <span className={`ml-auto text-[10px] sm:text-[11px] rounded-full px-1.5 py-0.5 font-semibold ${activeTab === 'Dibatalkan' ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'}`}>{countDibatalkan}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pagination arrows */}
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
                      <ChevronLeft size={13} className="text-gray-500" />
                    </button>
                    <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
                      <ChevronRight size={13} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Counter */}
                <span className="text-[11px] sm:text-xs text-gray-400 flex-shrink-0">{filtered.length === 0 ? '0 / 0' : `${page + 1} / ${totalPages}`}</span>
              </div>

              {/* ── Row: Desktop horizontal / Mobile vertical ── */}
              {visibleItem ? (
                <>
                  {/* MOBILE layout (<sm): stacked card */}
                  <div className="sm:hidden bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    <div className={`h-1 w-full ${activeTab === 'Selesai' ? 'bg-blue-500' : 'bg-red-400'}`} />
                    <div className="p-4 space-y-2">
                      <p className="font-bold text-gray-800 text-sm">{visibleItem.tanggal}</p>
                      <p className="text-gray-600 text-xs leading-relaxed">{visibleItem.deskripsi}</p>
                      <div className="flex items-center justify-between pt-1">
                        <p className="text-gray-700 text-xs font-medium">{visibleItem.ahli}</p>
                        {activeTab === 'Selesai' ? (
                          <span className="inline-block bg-green-100 text-green-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">Selesai</span>
                        ) : (
                          <span className="inline-block bg-red-100 text-red-500 text-[10px] font-semibold px-2.5 py-1 rounded-full">Dibatalkan</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DESKTOP layout (sm+): horizontal row */}
                  <div className="hidden sm:flex items-stretch bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    {/* Accent bar */}
                    <div className={`w-1 flex-shrink-0 ${activeTab === 'Selesai' ? 'bg-blue-500' : 'bg-red-400'}`} />

                    {/* Date */}
                    <div className="px-4 lg:px-5 py-3.5 border-r border-gray-200 flex-shrink-0 flex items-center">
                      <p className="font-bold text-gray-800 text-sm lg:text-base whitespace-nowrap">{visibleItem.tanggal}</p>
                    </div>

                    {/* Description */}
                    <div className="px-4 lg:px-5 py-3.5 flex-1 border-r border-gray-200 flex items-center min-w-0">
                      <p className="text-gray-600 text-xs lg:text-sm line-clamp-2">{visibleItem.deskripsi}</p>
                    </div>

                    {/* Ahli */}
                    <div className="px-4 lg:px-5 py-3.5 flex-shrink-0 border-r border-gray-200 flex items-center">
                      <p className="text-gray-700 text-xs lg:text-sm font-medium whitespace-nowrap">{visibleItem.ahli}</p>
                    </div>

                    {/* Status badge */}
                    <div className="px-4 lg:px-5 py-3.5 flex-shrink-0 flex items-center">
                      {activeTab === 'Selesai' ? (
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">Selesai</span>
                      ) : (
                        <span className="inline-block bg-red-100 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">Dibatalkan</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">Tidak ada data konsultasi {activeTab.toLowerCase()}.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
