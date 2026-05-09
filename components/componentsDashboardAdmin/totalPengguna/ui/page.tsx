'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { Users, UserPlus, UserCheck, Activity, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────
interface StatCard {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  border: string;
}

interface TableRow {
  segmen: string;
  icon: React.ReactNode;
  iconBg: string;
  total: number;
  aktif: number;
  persen: number;
  barColor: string;
}

// ─── Bulan Indonesia ─────────────────────────────────────────
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function formatTanggal(date: Date) {
  return `${HARI[date.getDay()]}, ${date.getDate()} - ${BULAN[date.getMonth()]} - ${date.getFullYear()}`;
}

// ─── Stat Cards Data ──────────────────────────────────────────
const STATS: StatCard[] = [
  {
    label: 'Total Pengguna',
    value: 1250,
    unit: 'Pengguna',
    icon: <Users size={22} strokeWidth={1.8} />,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    valueColor: 'text-green-500',
    border: 'border-gray-100',
  },
  {
    label: 'Pengguna Baru',
    value: 1250,
    unit: 'Pengguna',
    icon: <UserPlus size={22} strokeWidth={1.8} />,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
    valueColor: 'text-blue-500',
    border: 'border-gray-100',
  },
  {
    label: 'Pengguna Aktif',
    value: 1250,
    unit: 'Pengguna',
    icon: <UserCheck size={22} strokeWidth={1.8} />,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
    valueColor: 'text-orange-500',
    border: 'border-gray-100',
  },
  {
    label: 'Rata-rata Aktivitas',
    value: 1250,
    unit: 'Pengguna',
    icon: <Activity size={22} strokeWidth={1.8} />,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-500',
    valueColor: 'text-purple-500',
    border: 'border-gray-100',
  },
];

// ─── Table Data ───────────────────────────────────────────────
const TABLE_ROWS: TableRow[] = [
  {
    segmen: 'Semua Pengguna',
    icon: <Users size={16} strokeWidth={1.8} />,
    iconBg: 'bg-green-100 text-green-600',
    total: 1250,
    aktif: 980,
    persen: 78,
    barColor: 'bg-green-500',
  },
  {
    segmen: 'Pengguna Baru',
    icon: <UserPlus size={16} strokeWidth={1.8} />,
    iconBg: 'bg-orange-100 text-orange-500',
    total: 1250,
    aktif: 980,
    persen: 78,
    barColor: 'bg-orange-400',
  },
  {
    segmen: 'Pengguna Aktif',
    icon: <UserCheck size={16} strokeWidth={1.8} />,
    iconBg: 'bg-blue-100 text-blue-500',
    total: 1250,
    aktif: 980,
    persen: 78,
    barColor: 'bg-blue-600',
  },
];

// ─── Progress Bar ─────────────────────────────────────────────
function ProgressBar({ persen, barColor }: { persen: number; barColor: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[60px] sm:min-w-[80px]">
        <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{ width: `${persen}%` }} />
      </div>
      <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">{persen}%</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────
export default function ContainerTotalPengguna() {
  const { isCollapsed, isMobile } = useSidebar();
  const [expanded, setExpanded] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [activeDate] = useState(new Date());
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setDateOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const visibleRows = expanded ? TABLE_ROWS : TABLE_ROWS.slice(0, 3);

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6 sm:mb-8 mt-8 sm:mt-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Total Pengguna</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Kelola informasi pengguna aplikasi</p>
          </div>

          {/* Date picker badge */}
          <div className="relative flex-shrink-0 self-start sm:self-auto" ref={dateRef}>
            <button onClick={() => setDateOpen((o) => !o)} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors">
              <Calendar size={16} className="text-blue-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{formatTanggal(activeDate)}</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${dateOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Simple dropdown info */}
            {dateOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-56 text-sm text-gray-500">
                <p className="font-semibold text-gray-700 mb-1">Tanggal aktif</p>
                <p>{formatTanggal(activeDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {STATS.map((card) => (
            <div key={card.label} className={`bg-white rounded-2xl border ${card.border} shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4`}>
              {/* Icon */}
              <div className={`p-2.5 sm:p-3 rounded-full ${card.iconBg} ${card.iconColor} flex-shrink-0`}>{card.icon}</div>

              {/* Text */}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 font-medium leading-tight truncate">{card.label}</p>
                <p className={`text-xl sm:text-2xl font-bold ${card.valueColor} leading-tight mt-0.5`}>{card.value.toLocaleString('id-ID')}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{card.unit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Ringkasan Pengguna Card ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Card title */}
          <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">Ringkasan Pengguna</h2>
          </div>

          {/* ── DESKTOP TABLE (sm+) ── */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-[30%]">Segmentasi</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-[20%]">Totaal Pengguna</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-[20%]">Pengguna Aktif</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-[30%]">Presentasi Aktif</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    {/* Segmentasi */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`p-1.5 rounded-full ${row.iconBg}`}>{row.icon}</span>
                        <span className="font-medium text-gray-800">{row.segmen}</span>
                      </div>
                    </td>
                    {/* Total */}
                    <td className="px-6 py-4 text-gray-700 font-medium">{row.total.toLocaleString('id-ID')}</td>
                    {/* Aktif */}
                    <td className="px-6 py-4 text-gray-700 font-medium">{row.aktif.toLocaleString('id-ID')}</td>
                    {/* Progress */}
                    <td className="px-6 py-4">
                      <ProgressBar persen={row.persen} barColor={row.barColor} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARD LIST (<sm) ── */}
          <div className="sm:hidden divide-y divide-gray-100">
            {visibleRows.map((row, i) => (
              <div key={i} className="px-4 py-4">
                {/* Segmen header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`p-1.5 rounded-full ${row.iconBg}`}>{row.icon}</span>
                  <span className="font-semibold text-gray-800 text-sm">{row.segmen}</span>
                </div>
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-0.5">Total Pengguna</p>
                    <p className="text-sm font-semibold text-gray-700">{row.total.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-0.5">Pengguna Aktif</p>
                    <p className="text-sm font-semibold text-gray-700">{row.aktif.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                {/* Progress */}
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Presentasi Aktif</p>
                  <ProgressBar persen={row.persen} barColor={row.barColor} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Lihat Selengkapnya ── */}
          <div className="border-t border-gray-100 px-6 py-3 flex justify-center">
            <button onClick={() => setExpanded((e) => !e)} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              {expanded ? 'Sembunyikan' : 'Lihat Selengkapnya'}
              {expanded ? <ChevronUp size={15} strokeWidth={2} /> : <ChevronDown size={15} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
