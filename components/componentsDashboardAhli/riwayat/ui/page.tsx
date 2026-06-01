'use client';

import { User, Bell, Search, ChevronLeft, ChevronRight, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSidebar } from '@/hooks/useSidebar';
import { useCalendar } from '@/hooks/useCalendar';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDay } from '@/lib/libUser/calendar/dateUtils';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@/hooks/useUser';

type Riwayat = {
  id: string;
  user_name: string;
  user_email: string;
  completed_at: string;
  tanggal: string;
};

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

function formatLabelShort(date: Date): string {
  return `${date.getDate()} ${BULAN[date.getMonth()]}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

const ROW_HEIGHT = 57;
const MAX_VISIBLE = 6;
const MAX_HEIGHT = ROW_HEIGHT * MAX_VISIBLE;

export default function ContainerRiwayat() {
  const { isCollapsed, isMobile } = useSidebar();
  const { user } = useUser();
  const router = useRouter();

  const [allData, setAllData] = useState<Riwayat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const [activeDate, setActiveDate] = useState<Date>(today);

  const { monthName, year, calendarDays, goToPreviousMonth, goToNextMonth, goToToday, handleDateClick } = useCalendar(activeDate);

  // ── Fetch Data ──────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const { data: konsultasi, error } = await supabase
      .from('consultations')
      .select(
        `
        id,
        completed_at,
        created_at,
        users!consultations_user_id_fkey(full_name, email)
      `,
      )
      .eq('ahli_id', session.user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (!error && konsultasi) {
      const mapped: Riwayat[] = konsultasi.map((item: any) => {
        const dateStr = item.completed_at ?? item.created_at;
        return {
          id: item.id,
          user_name: item.users?.full_name ?? 'User',
          user_email: item.users?.email ?? '',
          completed_at: dateStr,
          tanggal: toDateString(new Date(dateStr)),
        };
      });

      setAllData(mapped);

      // Set tanggal yang punya data untuk kalender
      const dates = new Set(mapped.map((r) => r.tanggal));
      setActiveDates(dates);

      // Auto-pilih tanggal pertama yang ada data
      if (mapped.length > 0) {
        const firstDate = mapped[0].tanggal.split('-').map(Number);
        setActiveDate(new Date(firstDate[0], firstDate[1] - 1, firstDate[2]));
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Close calendar on outside click ────────────────────────
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) setCalendarOpen(false);
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

  // ── Filter ──────────────────────────────────────────────────
  const filtered = allData.filter((row) => {
    const matchDate = row.tanggal === toDateString(activeDate);
    const matchSearch = row.user_name.toLowerCase().includes(search.toLowerCase()) || row.user_email.toLowerCase().includes(search.toLowerCase());
    return matchDate && matchSearch;
  });

  function handleDetail(id: string) {
    router.push(`/ahli/riwayat/${id}`);
  }

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 gap-3 mt-10 sm:mt-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 break-words">Riwayat Konsultasi</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Lihat Riwayat Konsultasi</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0 ml-2 sm:ml-4">
            <div className="relative p-1.5 sm:p-2 md:p-2.5 bg-white rounded-full shadow-sm border border-slate-100 cursor-pointer">
              <Bell size={16} className="sm:w-5 sm:h-5 md:w-5 md:h-5 text-slate-600" />
              <div className="absolute top-0 right-0 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </div>
            <Link href="/ahli/profile">
              <div className="flex items-center cursor-pointer gap-2 sm:gap-2.5 md:gap-3 bg-primary text-white px-2 sm:px-3 md:px-6 py-1 sm:py-1.5 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
                  {!loading && user?.avatar_url ? <img src={user.avatar_url} alt={user.nama} className="w-full h-full object-cover" /> : <User size={14} className="sm:w-4 sm:h-4 text-primary" fill="currentColor" />}
                </div>
                <div className="hidden sm:flex flex-col whitespace-nowrap">
                  <span className="text-xs font-bold leading-none">{user?.nama || 'Ahli'}</span>
                  <span className="text-[10px] opacity-80 font-medium truncate">{user?.email || 'ahli@gmail.com'}</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          <div className="relative w-70 md:w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 sm:py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {/* Date Picker */}
          <div className="relative self-start xs:self-auto" ref={calendarRef}>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-2 py-1.5 shadow-sm">
              <button onClick={prevDay} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">
                <ChevronLeft size={14} strokeWidth={2} />
              </button>
              <button onClick={() => setCalendarOpen((o) => !o)} className="flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-lg hover:bg-gray-50 transition min-w-0">
                <Calendar size={13} className="text-blue-500 flex-shrink-0" strokeWidth={2} />
                <span className="hidden sm:inline text-sm font-medium text-gray-700 whitespace-nowrap select-none">{formatLabel(activeDate)}</span>
                <span className="sm:hidden text-xs font-medium text-gray-700 whitespace-nowrap select-none">{formatLabelShort(activeDate)}</span>
              </button>
              <button onClick={nextDay} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">
                <ChevronRight size={14} strokeWidth={2} />
              </button>
            </div>

            {calendarOpen && (
              <div className="absolute top-[calc(100%+8px)] z-50 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 sm:p-4 w-[260px] sm:w-[280px] left-0 max-w-[calc(100vw-2rem)]">
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
                    const hasData = activeDates.has(toDateString(day.fullDate)); // ← Real data!
                    return (
                      <button
                        key={i}
                        onClick={() => handleDayClick(day)}
                        disabled={!day.isCurrentMonth}
                        className={`relative h-7 sm:h-8 w-full rounded-lg text-[12px] sm:text-[13px] font-medium transition-colors
                          ${!day.isCurrentMonth ? 'text-gray-300 cursor-default' : isSelected ? 'bg-blue-600 text-white shadow-sm' : isToday ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
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

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full overflow-hidden">
          <div className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-5 pb-2 sm:pb-3">
            <h2 className="text-xs sm:text-sm md:text-[15px] font-semibold text-gray-800 tracking-wide">Riwayat Konsultasi Terbaru</h2>
          </div>
          <div className="h-[2px] w-full bg-blue-700" />

          {/* Desktop */}
          <div className="hidden sm:block">
            <table className="w-full text-xs sm:text-[12px] md:text-[13px] lg:text-[13.5px] table-fixed">
              <thead>
                <tr>
                  <th className="w-[32%] text-left text-gray-500 font-semibold px-3 sm:px-4 md:px-6 py-2.5 sm:py-3.5 text-[10px] sm:text-xs lg:text-sm">User</th>
                  <th className="w-[35%] text-left text-gray-500 font-semibold px-2 sm:px-3 md:px-4 py-2.5 sm:py-3.5 text-[10px] sm:text-xs lg:text-sm">Email</th>
                  <th className="w-[20%] text-left text-gray-500 font-semibold px-2 sm:px-3 md:px-4 py-2.5 sm:py-3.5 text-[10px] sm:text-xs lg:text-sm">Tanggal</th>
                  <th className="w-[13%] text-center text-gray-500 font-semibold px-3 sm:px-4 md:px-6 py-2.5 sm:py-3.5 text-[10px] sm:text-xs lg:text-sm">Aksi</th>
                </tr>
              </thead>
            </table>

            <div style={{ maxHeight: `${MAX_HEIGHT}px` }} className="overflow-y-auto">
              <table className="w-full text-xs sm:text-[12px] md:text-[13px] lg:text-[13.5px] table-fixed">
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 sm:py-12">
                        <div className="flex justify-center items-center gap-2 text-gray-400">
                          <Loader2 size={18} className="animate-spin" />
                          <span className="text-xs sm:text-sm">Memuat data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 sm:py-12">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Calendar size={18} className="sm:w-5 sm:h-5 text-gray-300" />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400 font-medium">Tidak ada riwayat pada tanggal ini</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100 hover:bg-blue-50 transition-colors duration-150">
                        <td className="w-[32%] px-3 sm:px-4 md:px-6 py-2.5 sm:py-3.5">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <User size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-400" />
                            </div>
                            <span className="text-xs sm:text-sm text-gray-800 font-medium truncate">{item.user_name}</span>
                          </div>
                        </td>
                        <td className="w-[35%] px-2 sm:px-3 md:px-4 py-2.5 sm:py-3.5 text-gray-500 text-[10px] sm:text-xs truncate">{item.user_email}</td>
                        <td className="w-[20%] px-2 sm:px-3 md:px-4 py-2.5 sm:py-3.5 text-gray-500 text-[10px] sm:text-xs md:text-sm">{formatLabel(activeDate)}</td>
                        <td className="w-[13%] px-3 sm:px-4 md:px-6 py-2.5 sm:py-3.5 text-center">
                          <button
                            onClick={() => handleDetail(item.id)}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-primary border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors active:scale-95 whitespace-nowrap"
                          >
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

          {/* Mobile */}
          <div className="sm:hidden">
            {loading ? (
              <div className="flex justify-center items-center py-8 gap-2 text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs">Memuat data...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <Calendar size={20} className="text-gray-300" />
                <p className="text-xs text-gray-400">Tidak ada riwayat pada tanggal ini</p>
              </div>
            ) : (
              <div style={{ maxHeight: `${MAX_HEIGHT + 60}px` }} className="overflow-y-auto divide-y divide-gray-100">
                {filtered.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{item.user_name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{item.user_email}</p>
                        <p className="text-[9px] text-gray-400 mt-0.5">{formatLabelShort(activeDate)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDetail(item.id)}
                      className="ml-2 flex-shrink-0 px-2 py-1 text-[10px] font-medium text-primary border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors active:scale-95 whitespace-nowrap"
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
