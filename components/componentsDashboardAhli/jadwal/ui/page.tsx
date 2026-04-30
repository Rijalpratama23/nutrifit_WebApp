'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { Bell, User, Calendar, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────
type StatusJadwal = 'hari_ini' | 'besok' | 'selesai';
type FilterType = 'semua' | StatusJadwal;

interface Jadwal {
  id: number;
  nama: string;
  email: string;
  keluhan: string;
  tujuan: string;
  tanggal: string;
  status: StatusJadwal;
}

// ─── Dummy Data ───────────────────────────────────────────────
const DUMMY_JADWAL: Jadwal[] = [
  { id: 1, nama: 'Dadan Sugandi', email: 'dadan@gmail.com', keluhan: 'Keluhan', tujuan: 'Menaikan berat badan', tanggal: 'Selasa, 8 Maret', status: 'hari_ini' },
  { id: 2, nama: 'Dadan Sugandi', email: 'dadan@gmail.com', keluhan: 'Keluhan', tujuan: 'Menaikan berat badan', tanggal: 'Selasa, 8 Maret', status: 'besok' },
  { id: 3, nama: 'Dadan Sugandi', email: 'dadan@gmail.com', keluhan: 'Keluhan', tujuan: 'Menaikan berat badan', tanggal: 'Selasa, 8 Maret', status: 'hari_ini' },
  { id: 4, nama: 'Dadan Sugandi', email: 'dadan@gmail.com', keluhan: 'Keluhan', tujuan: 'Menaikan berat badan', tanggal: 'Selasa, 8 Maret', status: 'selesai' },
  { id: 5, nama: 'Siti Rahayu', email: 'siti@gmail.com', keluhan: 'Keluhan', tujuan: 'Menurunkan berat badan', tanggal: 'Rabu, 9 Maret', status: 'hari_ini' },
  { id: 6, nama: 'Budi Santoso', email: 'budi@gmail.com', keluhan: 'Keluhan', tujuan: 'Diet seimbang', tanggal: 'Kamis, 10 Maret', status: 'selesai' },
];

// ─── Status Config ────────────────────────────────────────────
const STATUS_CONFIG: Record<StatusJadwal, { label: string; pill: string }> = {
  hari_ini: { label: 'Hari ini', pill: 'bg-orange-100 text-orange-600' },
  besok: { label: 'Besok', pill: 'bg-blue-100 text-blue-600' },
  selesai: { label: 'Selesai', pill: 'bg-gray-100 text-gray-500' },
};

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'semua', label: 'Semua' },
  { value: 'hari_ini', label: 'Hari ini' },
  { value: 'besok', label: 'Besok' },
  { value: 'selesai', label: 'Selesai' },
];

function AvatarIcon({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
  const ico = size === 'sm' ? 18 : 22;
  return (
    <div className={`${dim} rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0`}>
      <svg width={ico} height={ico} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill="#9ca3af" />
        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────
export default function ContainerJadwal() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('semua');

  const filtered = DUMMY_JADWAL.filter((item) => (activeFilter === 'semua' ? true : item.status === activeFilter));

  function handleChat(id: number) {
    router.push(`/ahli/jadwal/${id}/chat`);
  }

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div className="md:mt-0 mt-10">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Jadwal Konsultasi</h1>
            <p className="text-slate-500 text-xs sm:text-sm">Lihat jadwal yang tersedia</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative p-2 sm:p-2.5 bg-white rounded-full shadow-sm border border-slate-100 cursor-pointer">
              <Bell size={18} className="text-slate-600 sm:hidden" />
              <Bell size={20} className="text-slate-600 hidden sm:block" />
              <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </div>

            <Link href="/ahli/profile">
              {/* Desktop & Tablet — full pill */}
              <div className="hidden sm:flex items-center cursor-pointer gap-3 bg-primary text-white pr-6 pl-1.5 py-1.5 rounded-full shadow-lg">
                <div className="bg-white p-2 rounded-full text-primary">
                  <User size={18} fill="currentColor" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none">Ahli</span>
                  <span className="text-[10px] opacity-80 font-medium">ahli@gmail.com</span>
                </div>
              </div>
              {/* Mobile — icon only */}
              <div className="sm:hidden bg-primary p-2 rounded-full shadow-lg">
                <User size={16} className="text-white" fill="white" />
              </div>
            </Link>
          </div>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-2 flex-wrap mb-4 sm:mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 border
                ${activeFilter === f.value ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Card List ── */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center text-gray-400 text-sm">Tidak ada jadwal untuk filter ini.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((item) => {
              const cfg = STATUS_CONFIG[item.status];
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-150">
                  {/* ── DESKTOP & TABLET (sm ke atas) — satu baris ── */}
                  <div className="hidden sm:flex items-center gap-3 lg:gap-4 px-4 sm:px-5 lg:px-6 py-4">
                    <AvatarIcon />

                    {/* Nama + email */}
                    <div className="min-w-0 w-[130px] lg:w-[160px] flex-shrink-0">
                      <p className="text-[13px] lg:text-[13.5px] font-semibold text-gray-800 truncate">{item.nama}</p>
                      <p className="text-[10px] lg:text-[11px] text-gray-400 truncate">{item.email}</p>
                    </div>

                    {/* Keluhan + Tujuan */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] lg:text-[13px] font-medium text-gray-700 truncate">{item.keluhan}</p>
                      <p className="text-[10px] lg:text-[11px] text-gray-400 truncate">{item.tujuan}</p>
                    </div>

                    {/* Tanggal — muncul md ke atas */}
                    <div className="hidden md:flex items-center gap-1.5 text-gray-500 flex-shrink-0 min-w-[120px]">
                      <Calendar size={13} className="text-gray-400 flex-shrink-0" strokeWidth={1.8} />
                      <span className="text-[11px] lg:text-[12px] whitespace-nowrap">{item.tanggal}</span>
                    </div>

                    {/* Status pill */}
                    <span className={`flex-shrink-0 text-[10px] lg:text-[11px] font-medium px-2 lg:px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.pill}`}>{cfg.label}</span>

                    {/* Chat button */}
                    <button
                      onClick={() => handleChat(item.id)}
                      className="flex-shrink-0 flex items-center gap-1 lg:gap-1.5 px-3 lg:px-3.5 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-[11px] lg:text-xs font-medium rounded-full transition-colors active:scale-95"
                    >
                      <MessageCircle size={11} strokeWidth={2} />
                      chat
                    </button>
                  </div>

                  {/* ── MOBILE (di bawah sm) — card 2 baris ── */}
                  <div className="sm:hidden px-4 py-3.5">
                    {/* Baris 1: avatar + nama + status pill */}
                    <div className="flex items-center gap-3 mb-2">
                      <AvatarIcon size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800 truncate">{item.nama}</p>
                        <p className="text-[11px] text-gray-400 truncate">{item.email}</p>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full ${cfg.pill}`}>{cfg.label}</span>
                    </div>

                    {/* Baris 2: tujuan + tanggal + chat */}
                    <div className="flex items-center justify-between gap-2 pl-12">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-gray-600 truncate">
                          {item.keluhan} · {item.tujuan}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Calendar size={10} className="text-gray-400 flex-shrink-0" strokeWidth={1.8} />
                          <span className="text-[10px] text-gray-400">{item.tanggal}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleChat(item.id)}
                        className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-[11px] font-medium rounded-full transition-colors active:scale-95"
                      >
                        <MessageCircle size={10} strokeWidth={2} />
                        chat
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
