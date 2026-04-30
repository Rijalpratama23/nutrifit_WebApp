'use client';

import { User, Bell, Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useSidebar } from '@/hooks/useSidebar';
import { useCalendar } from '@/hooks/useCalendar';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDay } from '@/lib/libUser/calendar/dateUtils';

type Riwayat = {
  id: number;
  user: string;
  tujuan: string;
  tanggal: string;
};

const DUMMY_DATA: Riwayat[] = [
  { id: 1, user: 'Dadan Sugandi', tujuan: 'Menaikan berat badan', tanggal: '2025-03-08' },
  { id: 2, user: 'Siti Rahayu', tujuan: 'Menurunkan berat badan', tanggal: '2025-03-08' },
  { id: 3, user: 'Budi Santoso', tujuan: 'Diet seimbang', tanggal: '2025-03-08' },
  { id: 4, user: 'Dewi Lestari', tujuan: 'Menjaga berat badan', tanggal: '2025-03-08' },
  { id: 5, user: 'Rizky Fauzan', tujuan: 'Menaikan berat badan', tanggal: '2025-03-08' },
  { id: 6, user: 'Maya Indah', tujuan: 'Program gizi harian', tanggal: '2025-03-08' },
  { id: 7, user: 'Andi Pratama', tujuan: 'Menurunkan berat badan', tanggal: '2025-03-08' },
  { id: 8, user: 'Farhan Adi', tujuan: 'Menaikan berat badan', tanggal: '2025-03-08' },
  { id: 9, user: 'Dadan Sugandi', tujuan: 'Menjaga berat badan', tanggal: '2025-03-09' },
  { id: 10, user: 'Siti Rahayu', tujuan: 'Diet seimbang', tanggal: '2025-03-09' },
];

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DAY_HEADERS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatLabel(date: Date): string {
  return `${HARI[date.getDay()]}, ${date.getDate()} ${BULAN[date.getMonth()]}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

function parseDateLocal(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// ✅ Lebar kolom — WAJIB sama persis di thead & tbody agar kolom sejajar
const COL = {
  user: 'w-[30%] px-6 py-3.5',
  tujuan: 'w-[35%] px-4 py-3.5',
  tanggal: 'w-[22%] px-4 py-3.5',
  aksi: 'w-[13%] px-6 py-3.5',
};

// Tinggi 1 baris ≈ 57px, 6 baris = 342px → max-h sedikit lebih besar
const ROW_HEIGHT = 57;
const MAX_VISIBLE = 6;
const MAX_HEIGHT = ROW_HEIGHT * MAX_VISIBLE; // 342px

export default function ContainerRiwayat() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  const [activeDate, setActiveDate] = useState<Date>(
    parseDateLocal('2025-03-08'), // ganti ke new Date() saat pakai API real
  );

  const { monthName, year, calendarDays, goToPreviousMonth, goToNextMonth, goToToday, handleDateClick } = useCalendar(activeDate);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function prevDay() {
    setActiveDate((d) => {
      const nd = new Date(d);
      nd.setDate(nd.getDate() - 1);
      return nd;
    });
  }
  function nextDay() {
    setActiveDate((d) => {
      const nd = new Date(d);
      nd.setDate(nd.getDate() + 1);
      return nd;
    });
  }
  function handleDayClick(day: CalendarDay) {
    if (!day.isCurrentMonth) return;
    handleDateClick(day);
    setActiveDate(day.fullDate);
    setCalendarOpen(false);
  }
  function handleToday() {
    goToToday();
    setActiveDate(new Date());
    setCalendarOpen(false);
  }

  const filtered = DUMMY_DATA.filter((row) => {
    const matchDate = row.tanggal === toDateString(activeDate);
    const matchSearch = row.user.toLowerCase().includes(search.toLowerCase());
    return matchDate && matchSearch;
  });

  function handleDetail(id: number) {
    router.push(`/ahli/riwayat/${id}`);
  }

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-8">
          <div className="md:mt-0 mt-10">
            <h1 className="text-2xl font-bold text-slate-800">Riwayat Konsultasi</h1>
            <p className="text-slate-500 text-sm">Lihat Riwayat Konsultasi</p>
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
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="relative" ref={calendarRef}>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-2 py-1.5 shadow-sm">
              <button onClick={prevDay} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">
                <ChevronLeft size={15} strokeWidth={2} />
              </button>
              <button onClick={() => setCalendarOpen((o) => !o)} className="flex items-center gap-2 px-2 py-0.5 rounded-lg hover:bg-gray-50 transition">
                <Calendar size={14} className="text-blue-500" strokeWidth={2} />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap select-none">{formatLabel(activeDate)}</span>
              </button>
              <button onClick={nextDay} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">
                <ChevronRight size={15} strokeWidth={2} />
              </button>
            </div>

            {calendarOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-[280px]">
                <div className="flex items-center justify-between mb-3">
                  <button onClick={goToPreviousMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">
                    <ChevronLeft size={15} strokeWidth={2} />
                  </button>
                  <span className="text-sm font-semibold text-gray-800 select-none">
                    {monthName} {year}
                  </span>
                  <button onClick={goToNextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">
                    <ChevronRight size={15} strokeWidth={2} />
                  </button>
                </div>
                <div className="grid grid-cols-7 mb-1">
                  {DAY_HEADERS.map((h) => (
                    <div key={h} className="text-center text-[11px] font-medium text-gray-400 py-1">
                      {h}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-0.5">
                  {calendarDays.map((day, i) => {
                    const isSelected = isSameDay(day.fullDate, activeDate);
                    const isToday = isSameDay(day.fullDate, today);
                    const hasData = DUMMY_DATA.some((r) => r.tanggal === toDateString(day.fullDate));
                    return (
                      <button
                        key={i}
                        onClick={() => handleDayClick(day)}
                        disabled={!day.isCurrentMonth}
                        className={`relative h-8 w-full rounded-lg text-[13px] font-medium transition-colors
                          ${!day.isCurrentMonth ? 'text-gray-300 cursor-default' : isSelected ? 'bg-blue-600 text-white shadow-sm' : isToday ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {day.date}
                        {hasData && day.isCurrentMonth && !isSelected && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[11px] text-gray-400">{isSameDay(activeDate, today) ? 'Hari ini dipilih' : formatLabel(activeDate)}</span>
                  <button onClick={handleToday} className="text-[12px] font-medium text-blue-600 hover:underline transition">
                    Hari Ini
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full overflow-hidden">
          <div className="px-6 pt-5 pb-3">
            <h2 className="text-[15px] font-semibold text-gray-800 tracking-wide">Riwayat Konsultasi Terbaru</h2>
          </div>
          <div className="h-[2px] w-full bg-blue-700" />
          {/* thead — tidak scroll, selalu terlihat */}
          <table className="w-full text-[13.5px] table-fixed">
            <thead>
              <tr>
                <th className={`text-left text-gray-500 font-semibold ${COL.user}`}>User</th>
                <th className={`text-left text-gray-500 font-semibold ${COL.tujuan}`}>Tujuan</th>
                <th className={`text-left text-gray-500 font-semibold ${COL.tanggal}`}>Tanggal</th>
                <th className={`text-center text-gray-500 font-semibold ${COL.aksi}`}>Aksi</th>
              </tr>
            </thead>
          </table>

          {/* ✅ Div scroll: muncul otomatis saat data > 6 baris */}
          <div style={{ maxHeight: `${MAX_HEIGHT}px` }} className="overflow-y-auto">
            <table className="w-full text-[13.5px] table-fixed">
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-14 text-gray-400 text-sm">
                      Tidak ada riwayat konsultasi pada tanggal ini.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="border-t border-gray-100 hover:bg-blue-50 transition-colors duration-150">
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
                      <td className={`${COL.tujuan} text-gray-600`}>{item.tujuan}</td>
                      <td className={`${COL.tanggal} text-gray-500`}>{formatLabel(activeDate)}</td>
                      <td className={`${COL.aksi} text-center`}>
                        <button onClick={() => handleDetail(item.id)} className="px-3.5 py-1.5 text-xs font-medium text-primary border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors active:scale-95">
                          detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
