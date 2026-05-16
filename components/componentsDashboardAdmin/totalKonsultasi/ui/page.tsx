'use client';

import { useState, useRef } from 'react';
import { Calendar, ChevronDown, ChevronUp, MessageSquare, Users, XCircle, Leaf, Heart, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';

interface KategoriItem {
  kategori: string;
  total: number;
}

interface Props {
  totalKonsultasi: number;
  totalSelesai: number;
  totalDibatalkan: number;
  kategoriData: KategoriItem[];
}

// Warna otomatis berdasarkan index
const KATEGORI_STYLES = [
  { iconBg: 'bg-green-100 text-green-500', icon: <Leaf size={16} />, barColor: 'bg-green-400' },
  { iconBg: 'bg-blue-100 text-blue-500', icon: <Users size={16} />, barColor: 'bg-blue-500' },
  { iconBg: 'bg-orange-100 text-orange-400', icon: <Heart size={16} />, barColor: 'bg-orange-400' },
  { iconBg: 'bg-purple-100 text-purple-500', icon: <Activity size={16} />, barColor: 'bg-purple-400' },
  { iconBg: 'bg-pink-100 text-pink-400', icon: <Heart size={16} />, barColor: 'bg-pink-400' },
];

function ProgressBar({ persen, color }: { persen: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 sm:w-28 md:w-36 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${persen}%` }} />
      </div>
      <span className="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">{persen}%</span>
    </div>
  );
}

function StatCard({ label, value, unit, icon, iconBg, iconColor }: { label: string; value: number; unit: string; icon: React.ReactNode; iconBg: string; iconColor: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
      <div className={`${iconBg} ${iconColor} rounded-full p-2.5 sm:p-3 flex-shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] sm:text-xs text-gray-400 font-medium mb-0.5 truncate">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800 leading-none">
          {value.toLocaleString('id-ID')} <span className="text-xs sm:text-sm font-normal text-gray-400">{unit}</span>
        </p>
      </div>
    </div>
  );
}

export default function ContainerTotalKonsultasi({ totalKonsultasi, totalSelesai, totalDibatalkan, kategoriData }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);
  const { isCollapsed, isMobile } = useSidebar();

  const formatDisplayDate = (date: Date, isShort: boolean = false) => {
    return date.toLocaleDateString('id-ID', isShort ? { day: 'numeric', month: 'short', year: 'numeric' } : { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const getDateKey = (date: Date) => date.toISOString().split('T')[0];
  const calendarDays = generateCalendarDays();

  // Hitung persentase tiap kategori terhadap total
  const kategoriWithPersen = kategoriData.map((item, i) => ({
    ...item,
    persen: totalKonsultasi > 0 ? Math.round((item.total / totalKonsultasi) * 100) : 0,
    style: KATEGORI_STYLES[i % KATEGORI_STYLES.length],
  }));

  const displayRows = expanded ? kategoriWithPersen : kategoriWithPersen.slice(0, 3);

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="min-h-screen bg-[#f0f4fb] p-3 sm:p-4 md:p-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Total Konsultasi</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Kelola total Konsultasi</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="self-start sm:self-auto flex items-center gap-2 bg-white border border-blue-200 text-blue-600 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium shadow-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              <Calendar size={14} className="text-blue-500 flex-shrink-0" />
              <span className="hidden sm:inline">{formatDisplayDate(selectedDate)}</span>
              <span className="sm:hidden">{formatDisplayDate(selectedDate, true)}</span>
              <ChevronDown size={14} />
            </button>

            {/* Date Picker Calendar */}
            {showDatePicker && (
              <div ref={datePickerRef} className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 w-80">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button onClick={previousMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>
                  <h3 className="text-sm font-semibold text-gray-800 capitalize">{formatMonthYear(currentMonth)}</h3>
                  <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, idx) => {
                    const isSelected = day && getDateKey(day) === getDateKey(selectedDate);

                    return (
                      <button
                        key={idx}
                        onClick={() => day && handleDateSelect(day)}
                        disabled={!day}
                        className={`p-2 text-xs font-medium rounded-lg transition-colors ${!day ? 'text-gray-200 cursor-default' : isSelected ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        {day?.getDate()}
                      </button>
                    );
                  })}
                </div>

                {/* Close Button */}
                <button onClick={() => setShowDatePicker(false)} className="w-full mt-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatCard label="Total Konsultasi" value={totalKonsultasi} unit="Konsultasi" icon={<MessageSquare size={20} />} iconBg="bg-green-100" iconColor="text-green-500" />
          <StatCard label="Konsultasi Selesai" value={totalSelesai} unit="Konsultasi" icon={<Users size={20} />} iconBg="bg-blue-100" iconColor="text-blue-400" />
          <StatCard label="Konsultasi Dibatalkan" value={totalDibatalkan} unit="Konsultasi" icon={<XCircle size={20} />} iconBg="bg-orange-100" iconColor="text-orange-400" />
        </div>

        {/* Tabel Kategori */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-4 sm:mb-5">Konsultasi Berdasarkan Kategori</h2>

          {kategoriWithPersen.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <MessageSquare size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-400">Belum ada konsultasi</p>
              <p className="text-xs text-gray-300 mt-1">Data akan muncul setelah ada konsultasi antara user dan ahli</p>
            </div>
          ) : (
            <>
              {/* Mobile */}
              <div className="flex flex-col gap-3 sm:hidden">
                {displayRows.map((row) => (
                  <div key={row.kategori} className="bg-gray-50 rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`${row.style.iconBg} rounded-full p-1.5`}>{row.style.icon}</span>
                      <span className="font-semibold text-sm text-gray-700">{row.kategori}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Total</p>
                        <p className="font-bold text-sm text-gray-700">{row.total.toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Persentase</p>
                        <ProgressBar persen={row.persen} color={row.style.barColor} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop */}
              <div className="hidden sm:block">
                <div className="grid grid-cols-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100 pb-2 mb-1">
                  <span>Kategori</span>
                  <span>Total Konsultasi</span>
                  <span>Presentasi Aktif</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {displayRows.map((row) => (
                    <div key={row.kategori} className="grid grid-cols-3 items-center py-3 hover:bg-gray-50 transition-colors rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className={`${row.style.iconBg} rounded-full p-1.5`}>{row.style.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{row.kategori}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{row.total.toLocaleString('id-ID')}</span>
                      <ProgressBar persen={row.persen} color={row.style.barColor} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggle */}
              {kategoriWithPersen.length > 3 && (
                <div className="flex justify-center mt-4">
                  <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors">
                    {expanded ? 'Sembunyikan' : 'Lihat Selengkapnya'}
                    {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
