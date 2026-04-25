'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, User, Search, ChevronDown, MessageCircle } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
type StatusType = 'aktif' | 'menunggu' | 'selesai';

interface Konsultasi {
  id: number;
  nama: string;
  tujuan: string;
  status: StatusType;
  waktu: string;
}

type FilterType = 'semua' | StatusType;

// ─── Dummy Data ───────────────────────────────────────────────
const DUMMY_DATA: Konsultasi[] = [
  { id: 1, nama: 'Dadan Sugandi',  tujuan: 'Menaikan berat badan',   status: 'aktif',    waktu: '10-03-06 | 10:00' },
  { id: 2, nama: 'Siti Rahayu',    tujuan: 'Menurunkan berat badan',  status: 'menunggu', waktu: '10-03-07 | 09:00' },
  { id: 3, nama: 'Budi Santoso',   tujuan: 'Diet seimbang',           status: 'selesai',  waktu: '10-03-05 | 14:00' },
  { id: 4, nama: 'Dewi Lestari',   tujuan: 'Menjaga berat badan',     status: 'aktif',    waktu: '10-03-06 | 11:00' },
  { id: 5, nama: 'Rizky Fauzan',   tujuan: 'Menaikan berat badan',    status: 'menunggu', waktu: '10-03-07 | 13:00' },
  { id: 6, nama: 'Maya Indah',     tujuan: 'Program gizi harian',     status: 'aktif',    waktu: '10-03-06 | 15:00' },
  { id: 7, nama: 'Andi Pratama',   tujuan: 'Menurunkan berat badan',  status: 'selesai',  waktu: '10-03-04 | 10:00' },
  { id: 8, nama: 'Farhan Adi',     tujuan: 'Menaikan berat badan',    status: 'aktif',    waktu: '10-03-06 | 16:30' },
];

// ─── Status Config ────────────────────────────────────────────
const STATUS_CONFIG: Record<StatusType, { label: string; pill: string; dot: string }> = {
  aktif:    { label: 'Aktif',    pill: 'bg-green-100 text-green-700',   dot: 'bg-green-500'  },
  menunggu: { label: 'Menunggu', pill: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  selesai:  { label: 'Selesai',  pill: 'bg-gray-100 text-gray-500',     dot: 'bg-gray-400'   },
};

const FILTER_OPTIONS: { value: FilterType; label: string; dot: string }[] = [
  { value: 'semua',    label: 'Semua',    dot: 'bg-gray-300'   },
  { value: 'aktif',    label: 'Aktif',    dot: 'bg-green-500'  },
  { value: 'menunggu', label: 'Menunggu', dot: 'bg-yellow-400' },
  { value: 'selesai',  label: 'Selesai',  dot: 'bg-gray-400'   },
];

// ─── Lebar kolom — sama persis di thead & tbody ───────────────
const COL = {
  user:   'w-[25%] px-6 py-3',
  tujuan: 'w-[28%] px-6 py-3',
  status: 'w-[17%] px-6 py-3',
  waktu:  'w-[18%] px-6 py-3',
  aksi:   'w-[12%] px-6 py-3',
};

// ─── Component ────────────────────────────────────────────────
export default function ContainerKonsultasi() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();

  const [search, setSearch]             = useState('');
  const [filter, setFilter]             = useState<FilterType>('semua');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef                     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = DUMMY_DATA.filter((row) => {
    const matchFilter = filter === 'semua' || row.status === filter;
    const matchSearch = row.nama.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const activeFilterLabel =
    filter === 'semua' ? 'Filter Status' : STATUS_CONFIG[filter as StatusType].label;

  function handleChat(id: number) {
    router.push(`/ahli/konsultasi/${id}/chat`);
  }

  return (
    <div
      className={`flex-1 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${
        isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'
      }`}
    >
      <div className="p-4 sm:p-6 lg:p-10">

        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-8">
          <div className="md:mt-0 mt-10">
            <h1 className="text-2xl font-bold text-slate-800">Konsultasi Aktif</h1>
            <p className="text-slate-500 text-sm">Lihat & kelola konsultasi aktif</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative p-2.5 bg-white rounded-full shadow-sm border border-slate-100 cursor-pointer">
              <Bell size={20} className="text-slate-600" />
              <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </div>

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

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative max-w-xs w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
              strokeWidth={1.8}
            />
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm border rounded-xl bg-white transition whitespace-nowrap select-none ${
                dropdownOpen || filter !== 'semua'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {filter !== 'semua' && (
                <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[filter as StatusType].dot}`} />
              )}
              {activeFilterLabel}
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 min-w-[160px] flex flex-col gap-0.5">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilter(opt.value);
                      setDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-3.5 py-2 text-sm rounded-lg mx-1 transition ${
                      filter === opt.value
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${opt.dot}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {/* Card Header */}
          <div className="px-6 pt-5">
            <h2 className="text-[15px] font-medium text-gray-900 pb-4 border-b-2 border-primary w-full inline-block">
              Permintaan Konsultasi Terbaru
            </h2>
          </div>

          {/* thead — fixed, tidak ikut scroll */}
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="border-b border-gray-100">
                <th className={`text-left text-xs font-medium text-gray-400 ${COL.user}`}>User</th>
                <th className={`text-left text-xs font-medium text-gray-400 ${COL.tujuan}`}>Tujuan</th>
                <th className={`text-left text-xs font-medium text-gray-400 ${COL.status}`}>Status</th>
                <th className={`text-left text-xs font-medium text-gray-400 ${COL.waktu}`}>Waktu</th>
                <th className={`text-right text-xs font-medium text-gray-400 ${COL.aksi}`}>Aksi</th>
              </tr>
            </thead>
          </table>

          {/* tbody scroll area — muncul scrollbar saat data > 6 baris */}
          <div className="max-h-[372px] overflow-y-auto">
            <table className="w-full text-sm table-fixed">
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                      Tidak ada data konsultasi ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => {
                    const cfg = STATUS_CONFIG[row.status];
                    return (
                      <tr
                        key={row.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        {/* User */}
                        <td className={COL.user}>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                              <User size={15} strokeWidth={1.5} className="text-gray-400" />
                            </div>
                            <span className="font-medium text-gray-800 truncate">{row.nama}</span>
                          </div>
                        </td>

                        {/* Tujuan */}
                        <td className={`${COL.tujuan} text-gray-500`}>{row.tujuan}</td>

                        {/* Status */}
                        <td className={COL.status}>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>

                        {/* Waktu */}
                        <td className={`${COL.waktu} text-gray-400 text-xs`}>{row.waktu}</td>

                        {/* Aksi */}
                        <td className={`${COL.aksi} text-right`}>
                          <button
                            onClick={() => handleChat(row.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium rounded-full transition-colors active:scale-95"
                          >
                            <MessageCircle size={12} strokeWidth={2} />
                            chat
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}