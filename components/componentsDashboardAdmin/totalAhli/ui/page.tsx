'use client';

import { useState } from 'react';
import { Stethoscope, UserPlus, UserCheck, Activity, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatCard {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  color: string;
  iconColor: string;
}

interface TableRow {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  total: number;
  aktif: number;
  persen: number;
  barColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const stats: StatCard[] = [
  {
    label: 'Total Ahli',
    value: '1.250',
    unit: 'Ahli',
    icon: <Stethoscope size={20} />,
    color: 'bg-green-100',
    iconColor: 'text-green-500',
  },
  {
    label: 'Pengguna Baru',
    value: '1.250',
    unit: 'Ahli',
    icon: <UserPlus size={20} />,
    color: 'bg-blue-100',
    iconColor: 'text-blue-400',
  },
  {
    label: 'Pengguna Aktif',
    value: '1.250',
    unit: 'Ahli',
    icon: <UserCheck size={20} />,
    color: 'bg-orange-100',
    iconColor: 'text-orange-400',
  },
  {
    label: 'Rata-rata Aktivitas',
    value: '1.250',
    unit: 'Ahli',
    icon: <Activity size={20} />,
    color: 'bg-purple-100',
    iconColor: 'text-purple-400',
  },
];

const tableRows: TableRow[] = [
  {
    label: 'Total Pengguna',
    icon: <Stethoscope size={16} />,
    iconBg: 'bg-green-100 text-green-500',
    total: 1250,
    aktif: 980,
    persen: 78,
    barColor: 'bg-green-400',
  },
  {
    label: 'Pengguna Baru',
    icon: <UserPlus size={16} />,
    iconBg: 'bg-orange-100 text-orange-400',
    total: 1250,
    aktif: 980,
    persen: 78,
    barColor: 'bg-orange-400',
  },
  {
    label: 'Pengguna Aktif',
    icon: <UserCheck size={16} />,
    iconBg: 'bg-blue-100 text-blue-400',
    total: 1250,
    aktif: 980,
    persen: 78,
    barColor: 'bg-blue-500',
  },
];

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ persen, color, slim = false }: { persen: number; color: string; slim?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${slim ? 'w-16' : 'w-16 sm:w-24 md:w-28'} h-2 bg-gray-100 rounded-full overflow-hidden`}>
        <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${persen}%` }} />
      </div>
      <span className="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">{persen}%</span>
    </div>
  );
}

// ─── Mobile Card Row ──────────────────────────────────────────────────────────
function MobileRow({ row }: { row: TableRow }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className={`${row.iconBg} rounded-full p-1.5`}>{row.icon}</span>
        <span className="font-semibold text-sm text-gray-700">{row.label}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Total Ahli</p>
          <p className="font-bold text-sm text-gray-700">{row.total.toLocaleString('id-ID')}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Aktif</p>
          <p className="font-bold text-sm text-gray-700">{row.aktif.toLocaleString('id-ID')}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Presentasi</p>
          <ProgressBar persen={row.persen} color={row.barColor} slim />
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Table Row ────────────────────────────────────────────────────────
function DesktopRow({ row }: { row: TableRow }) {
  return (
    <div className="grid grid-cols-4 items-center py-3 text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <span className={`${row.iconBg} rounded-full p-1.5`}>{row.icon}</span>
        <span className="font-medium">{row.label}</span>
      </div>
      <span className="text-center font-semibold">{row.total.toLocaleString('id-ID')}</span>
      <span className="text-center font-semibold">{row.aktif.toLocaleString('id-ID')}</span>
      <div className="flex justify-center">
        <ProgressBar persen={row.persen} color={row.barColor} />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContainerTotalAhli() {
  const { isCollapsed, isMobile } = useSidebar();
  const [expanded, setExpanded] = useState(false);

  const displayRows = expanded ? tableRows : tableRows.slice(0, 3);

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="min-h-screen bg-[#f0f4fb] p-3 sm:p-4 md:p-6 font-sans">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Total Ahli</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Kelola informasi Ahli Gizi</p>
          </div>

          {/* Date button — full width on mobile, auto on sm+ */}
          <button
            className="
          flex items-center justify-center sm:justify-start gap-2
          bg-white border border-blue-200 text-blue-600
          rounded-xl px-3 sm:px-4 py-2
          text-xs sm:text-sm font-medium shadow-sm
          hover:bg-blue-50 transition-colors
          w-full sm:w-auto whitespace-nowrap
        "
          >
            <Calendar size={14} className="text-blue-500 flex-shrink-0" />
            {/* Short date on very small screens */}
            <span className="sm:hidden">23 Mei 2026</span>
            <span className="hidden sm:inline">Senin, 23 - Mei - 2026</span>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* ── Stat Cards ──
          - mobile  : 1 kolom
          - sm (≥640): 2 kolom
          - lg (≥1024): 4 kolom
      ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {stats.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
              <div className={`${card.color} ${card.iconColor} rounded-full p-2.5 sm:p-3 flex-shrink-0`}>{card.icon}</div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs text-gray-400 font-medium mb-0.5 truncate">{card.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 leading-none">
                  {card.value} <span className="text-xs sm:text-sm font-normal text-gray-400">{card.unit}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Ringkasan Pengguna ── */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-4 sm:mb-5">Ringkasan Pengguna</h2>

          {/* Mobile: card style */}
          <div className="flex flex-col gap-3 sm:hidden">
            {displayRows.map((row) => (
              <MobileRow key={row.label} row={row} />
            ))}
          </div>

          {/* Desktop: table style */}
          <div className="hidden sm:block">
            <div
              className="
            grid grid-cols-4
            text-xs font-semibold text-gray-400
            uppercase tracking-wide
            border-b border-gray-100 pb-2 mb-1
          "
            >
              <span>Segmentasi</span>
              <span className="text-center">Total Ahli</span>
              <span className="text-center">Pengguna Aktif</span>
              <span className="text-center">Presentasi Aktif</span>
            </div>
            <div className="divide-y divide-gray-50">
              {displayRows.map((row) => (
                <DesktopRow key={row.label} row={row} />
              ))}
            </div>
          </div>

          {/* Toggle button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="
              flex items-center gap-1
              text-blue-500 hover:text-blue-700
              text-xs sm:text-sm font-medium
              transition-colors
            "
            >
              {expanded ? 'Sembunyikan' : 'Lihat Selengkapnya'}
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
