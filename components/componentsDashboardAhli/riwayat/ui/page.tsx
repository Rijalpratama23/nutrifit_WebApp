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

// Label pendek untuk mobile (tanpa nama hari)
function formatLabelShort(date: Date): string {
  return `${date.getDate()} ${BULAN[date.getMonth()]}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

function parseDateLocal(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const ROW_HEIGHT = 57;
const MAX_VISIBLE = 6;
const MAX_HEIGHT = ROW_HEIGHT * MAX_VISIBLE;

export default function ContainerRiwayat() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  const [activeDate, setActiveDate] = useState<Date>(parseDateLocal('2025-03-08'));

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
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">Riwayat Konsultasi</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Lihat Riwayat Konsultasi</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Bell - hidden on very small screens, visible from xs */}
            <div className="relative p-2 sm:p-2.5 bg-white rounded-full shadow-sm border border-slate-100 cursor-pointer">
              <Bell size={18} className="text-slate-600" />
              <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </div>

            {/* Profile button — compact on mobile */}
            <Link href="/ahli/profile">
              <div className="flex items-center cursor-pointer gap-2 sm:gap-3 bg-primary text-white sm:pr-6 pr-3 pl-1.5 py-1.5 rounded-full shadow-lg">
                <div className="bg-white p-1.5 sm:p-2 rounded-full text-primary flex-shrink-0">
                  <User size={16} fill="currentColor" />
                </div>
                {/* Text only visible on sm+ */}
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-bold leading-none">Ahli</span>
                  <span className="text-[10px] opacity-80 font-medium">ahli@gmail.com</span>
                </div>
              </div>
            </Link>
          </div>
        </div>  

        {/* ── Toolbar ── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          {/* Search — full width on mobile, max-xs on larger */}
          <div className="relative w-70 md:w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 sm:py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {/* Date Picker */}
          <div className="relative self-start xs:self-auto" ref={calendarRef}>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-2 py-1.5 shadow-sm">
              <button onClick={prevDay} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500" aria-label="Hari sebelumnya">
                <ChevronLeft size={14} strokeWidth={2} />
              </button>

              <button onClick={() => setCalendarOpen((o) => !o)} className="flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-lg hover:bg-gray-50 transition min-w-0">
                <Calendar size={13} className="text-blue-500 flex-shrink-0" strokeWidth={2} />
                {/* Full label on sm+, short label on mobile */}
                <span className="hidden sm:inline text-sm font-medium text-gray-700 whitespace-nowrap select-none">{formatLabel(activeDate)}</span>
                <span className="sm:hidden text-xs font-medium text-gray-700 whitespace-nowrap select-none">{formatLabelShort(activeDate)}</span>
              </button>

              <button onClick={nextDay} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500" aria-label="Hari berikutnya">
                <ChevronRight size={14} strokeWidth={2} />
              </button>
            </div>

            {/* Calendar Dropdown — responsive position */}
            {calendarOpen && (
              <div
                className="
                  absolute top-[calc(100%+8px)] z-50
                  bg-white border border-gray-200 rounded-2xl shadow-xl p-3 sm:p-4
                  w-[260px] sm:w-[280px]
                  left-0
                  /* Prevent overflow on small screens */
                  max-w-[calc(100vw-2rem)]
                "
              >
                <div className="flex items-center justify-between mb-3">
                  <button onClick={goToPreviousMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">
                    <ChevronLeft size={14} strokeWidth={2} />
                  </button>
                  <span className="text-sm font-semibold text-gray-800 select-none">
                    {monthName} {year}
                  </span>
                  <button onClick={goToNextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">
                    <ChevronRight size={14} strokeWidth={2} />
                  </button>
                </div>

                <div className="grid grid-cols-7 mb-1">
                  {DAY_HEADERS.map((h) => (
                    <div key={h} className="text-center text-[10px] sm:text-[11px] font-medium text-gray-400 py-1">
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
                        className={`
                          relative h-7 sm:h-8 w-full rounded-lg text-[12px] sm:text-[13px] font-medium transition-colors
                          ${!day.isCurrentMonth ? 'text-gray-300 cursor-default' : isSelected ? 'bg-blue-600 text-white shadow-sm' : isToday ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}
                        `}
                      >
                        {day.date}
                        {hasData && day.isCurrentMonth && !isSelected && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] sm:text-[11px] text-gray-400">{isSameDay(activeDate, today) ? 'Hari ini dipilih' : formatLabelShort(activeDate)}</span>
                  <button onClick={handleToday} className="text-[11px] sm:text-[12px] font-medium text-blue-600 hover:underline transition">
                    Hari Ini
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full overflow-hidden">
          <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-2 sm:pb-3">
            <h2 className="text-sm sm:text-[15px] font-semibold text-gray-800 tracking-wide">Riwayat Konsultasi Terbaru</h2>
          </div>
          <div className="h-[2px] w-full bg-blue-700" />

          {/* 
            DESKTOP & TABLET (sm+): Tabel biasa dengan thead fixed + tbody scroll
            MOBILE (<sm): Card list layout agar tidak sempit 
          */}

          {/* ── Desktop/Tablet View ── */}
          <div className="hidden sm:block">
            <table className="w-full text-[13px] lg:text-[13.5px] table-fixed">
              <thead>
                <tr>
                  <th className="w-[32%] text-left text-gray-500 font-semibold px-4 lg:px-6 py-3.5 text-xs lg:text-sm">User</th>
                  <th className="w-[35%] text-left text-gray-500 font-semibold px-3 lg:px-4 py-3.5 text-xs lg:text-sm">Tujuan</th>
                  <th className="w-[20%] text-left text-gray-500 font-semibold px-3 lg:px-4 py-3.5 text-xs lg:text-sm">Tanggal</th>
                  <th className="w-[13%] text-center text-gray-500 font-semibold px-4 lg:px-6 py-3.5 text-xs lg:text-sm">Aksi</th>
                </tr>
              </thead>
            </table>

            <div style={{ maxHeight: `${MAX_HEIGHT}px` }} className="overflow-y-auto">
              <table className="w-full text-[13px] lg:text-[13.5px] table-fixed">
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-400 text-sm">
                        Tidak ada riwayat konsultasi pada tanggal ini.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100 hover:bg-blue-50 transition-colors duration-150">
                        <td className="w-[32%] px-4 lg:px-6 py-3.5">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" fill="#9e9e9e" />
                                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </div>
                            <span className="text-gray-800 font-medium truncate">{item.user}</span>
                          </div>
                        </td>
                        <td className="w-[35%] px-3 lg:px-4 py-3.5 text-gray-600 truncate">{item.tujuan}</td>
                        <td className="w-[20%] px-3 lg:px-4 py-3.5 text-gray-500 text-xs lg:text-sm">{formatLabel(activeDate)}</td>
                        <td className="w-[13%] px-4 lg:px-6 py-3.5 text-center">
                          <button onClick={() => handleDetail(item.id)} className="px-3 lg:px-3.5 py-1.5 text-xs font-medium text-primary border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors active:scale-95">
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

          {/* ── Mobile View: Card List ── */}
          <div className="sm:hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">Tidak ada riwayat konsultasi pada tanggal ini.</div>
            ) : (
              <div style={{ maxHeight: `${MAX_HEIGHT + 60}px` }} className="overflow-y-auto divide-y divide-gray-100">
                {filtered.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors">
                    {/* Left: Avatar + Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" fill="#9e9e9e" />
                          <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.user}</p>
                        <p className="text-xs text-gray-500 truncate">{item.tujuan}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{formatLabelShort(activeDate)}</p>
                      </div>
                    </div>

                    {/* Right: Action button */}
                    <button
                      onClick={() => handleDetail(item.id)}
                      className="ml-3 flex-shrink-0 px-3 py-1.5 text-xs font-medium text-primary border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors active:scale-95"
                    >
                      detail
                    </button>
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
