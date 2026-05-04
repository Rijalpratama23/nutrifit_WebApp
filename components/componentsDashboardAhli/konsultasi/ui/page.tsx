'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown,User, MessageCircle } from 'lucide-react';
import Header from './header/page';

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
  { id: 1, nama: 'Dadan Sugandi', tujuan: 'Menaikan berat badan', status: 'aktif', waktu: '10-03-06 | 10:00' },
  { id: 2, nama: 'Siti Rahayu', tujuan: 'Menurunkan berat badan', status: 'menunggu', waktu: '10-03-07 | 09:00' },
  { id: 3, nama: 'Budi Santoso', tujuan: 'Diet seimbang', status: 'selesai', waktu: '10-03-05 | 14:00' },
  { id: 4, nama: 'Dewi Lestari', tujuan: 'Menjaga berat badan', status: 'aktif', waktu: '10-03-06 | 11:00' },
  { id: 5, nama: 'Rizky Fauzan', tujuan: 'Menaikan berat badan', status: 'menunggu', waktu: '10-03-07 | 13:00' },
  { id: 6, nama: 'Maya Indah', tujuan: 'Program gizi harian', status: 'aktif', waktu: '10-03-06 | 15:00' },
  { id: 7, nama: 'Andi Pratama', tujuan: 'Menurunkan berat badan', status: 'selesai', waktu: '10-03-04 | 10:00' },
  { id: 8, nama: 'Farhan Adi', tujuan: 'Menaikan berat badan', status: 'aktif', waktu: '10-03-06 | 16:30' },
];

// ─── Status Config ────────────────────────────────────────────
const STATUS_CONFIG: Record<StatusType, { label: string; pill: string; dot: string }> = {
  aktif: { label: 'Aktif', pill: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  menunggu: { label: 'Menunggu', pill: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  selesai: { label: 'Selesai', pill: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
};

const FILTER_OPTIONS: { value: FilterType; label: string; dot: string }[] = [
  { value: 'semua', label: 'Semua', dot: 'bg-gray-300' },
  { value: 'aktif', label: 'Aktif', dot: 'bg-green-500' },
  { value: 'menunggu', label: 'Menunggu', dot: 'bg-yellow-400' },
  { value: 'selesai', label: 'Selesai', dot: 'bg-gray-400' },
];

// ─── Component ────────────────────────────────────────────────
export default function ContainerKonsultasi() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('semua');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const activeFilterLabel = filter === 'semua' ? 'Filter' : STATUS_CONFIG[filter as StatusType].label;

  function handleChat(id: number) {
    router.push(`/ahli/konsultasi/${id}/chat`);
  }

  return (
    <div className={`flex-1 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        {/* ── Header ── */}
        <Header />

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          {/* Search — flex-1 on mobile, capped on sm+ */}
          <div className="relative flex-1 sm:flex-none sm:w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 sm:py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border rounded-xl bg-white transition whitespace-nowrap select-none ${
                dropdownOpen || filter !== 'semua' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {filter !== 'semua' && <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[filter as StatusType].dot}`} />}
              {activeFilterLabel}
              <ChevronDown size={13} strokeWidth={2} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-[calc(100%+6px)] right-0 sm:left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 min-w-[140px] sm:min-w-[160px] flex flex-col gap-0.5">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilter(opt.value);
                      setDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm rounded-lg mx-1 transition ${filter === opt.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 ${opt.dot}`} />
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
          <div className="px-4 sm:px-6 pt-4 sm:pt-5">
            <h2 className="text-sm sm:text-[15px] font-medium text-gray-900 pb-3 sm:pb-4 border-b-2 border-primary w-full inline-block">Permintaan Konsultasi Terbaru</h2>
          </div>

          {/* ── DESKTOP / TABLET (sm+): tabel dengan thead fixed ── */}
          <div className="hidden sm:block">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="w-[25%] text-left text-xs font-medium text-gray-400 px-4 lg:px-6 py-3">User</th>
                  <th className="w-[28%] text-left text-xs font-medium text-gray-400 px-4 lg:px-6 py-3">Tujuan</th>
                  <th className="w-[17%] text-left text-xs font-medium text-gray-400 px-4 lg:px-6 py-3">Status</th>
                  <th className="w-[18%] text-left text-xs font-medium text-gray-400 px-4 lg:px-6 py-3">Waktu</th>
                  <th className="w-[12%] text-right text-xs font-medium text-gray-400 px-4 lg:px-6 py-3">Aksi</th>
                </tr>
              </thead>
            </table>

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
                        <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                          {/* User */}
                          <td className="w-[25%] px-4 lg:px-6 py-3">
                            <div className="flex items-center gap-2 lg:gap-2.5">
                              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                <User size={13} strokeWidth={1.5} className="text-gray-400" />
                              </div>
                              <span className="font-medium text-gray-800 text-xs lg:text-sm truncate">{row.nama}</span>
                            </div>
                          </td>

                          {/* Tujuan */}
                          <td className="w-[28%] px-4 lg:px-6 py-3 text-gray-500 text-xs lg:text-sm truncate">{row.tujuan}</td>

                          {/* Status */}
                          <td className="w-[17%] px-4 lg:px-6 py-3">
                            <span className={`inline-flex items-center gap-1 lg:gap-1.5 px-2 lg:px-2.5 py-1 rounded-full text-[11px] lg:text-xs font-medium ${cfg.pill}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                          </td>

                          {/* Waktu */}
                          <td className="w-[18%] px-4 lg:px-6 py-3 text-gray-400 text-[11px] lg:text-xs">{row.waktu}</td>

                          {/* Aksi */}
                          <td className="w-[12%] px-4 lg:px-6 py-3 text-right">
                            <button
                              onClick={() => handleChat(row.id)}
                              className="inline-flex items-center gap-1 lg:gap-1.5 px-2.5 lg:px-3.5 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-[11px] lg:text-xs font-medium rounded-full transition-colors active:scale-95"
                            >
                              <MessageCircle size={11} strokeWidth={2} />
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

          {/* ── MOBILE (<sm): card list layout ── */}
          <div className="sm:hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">Tidak ada data konsultasi ditemukan.</div>
            ) : (
              <div className="max-h-[440px] overflow-y-auto divide-y divide-gray-100">
                {filtered.map((row) => {
                  const cfg = STATUS_CONFIG[row.status];
                  return (
                    <div key={row.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors gap-3">
                      {/* Left: avatar + info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <User size={15} strokeWidth={1.5} className="text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{row.nama}</p>
                          <p className="text-xs text-gray-500 truncate">{row.tujuan}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.pill}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                            <span className="text-[10px] text-gray-400">{row.waktu}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: chat button */}
                      <button
                        onClick={() => handleChat(row.id)}
                        className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium rounded-full transition-colors active:scale-95"
                      >
                        <MessageCircle size={11} strokeWidth={2} />
                        chat
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
