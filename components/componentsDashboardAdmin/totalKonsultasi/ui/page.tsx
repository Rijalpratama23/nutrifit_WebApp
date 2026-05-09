'use client';

import { useState } from 'react';
import {
  Calendar, ChevronDown, ChevronUp,
  MessageSquare, Users, XCircle, Leaf, Salad, Heart,
} from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';

// ─── Types ────────────────────────────────────────────────────────────────────
interface KategoriRow {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  total: number;
  persen: number;
  barColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const kategoriRows: KategoriRow[] = [
  {
    label: 'Konsultasi Gizi',
    icon: <Leaf size={16} />,
    iconBg: 'bg-green-100 text-green-500',
    total: 980,
    persen: 78,
    barColor: 'bg-green-400',
  },
  {
    label: 'Konsultasi Pola makan',
    icon: <Users size={16} />,
    iconBg: 'bg-blue-100 text-blue-500',
    total: 980,
    persen: 78,
    barColor: 'bg-blue-500',
  },
  {
    label: 'Konsultasi Hidup Sehat',
    icon: <Heart size={16} />,
    iconBg: 'bg-orange-100 text-orange-400',
    total: 980,
    persen: 78,
    barColor: 'bg-orange-400',
  },
  {
    label: 'Konsultasi Olahraga',
    icon: <Salad size={16} />,
    iconBg: 'bg-purple-100 text-purple-500',
    total: 980,
    persen: 78,
    barColor: 'bg-purple-400',
  },
  {
    label: 'Konsultasi Mental',
    icon: <Heart size={16} />,
    iconBg: 'bg-pink-100 text-pink-400',
    total: 980,
    persen: 78,
    barColor: 'bg-pink-400',
  },
];

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ persen, color }: { persen: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 sm:w-28 md:w-36 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`${color} h-full rounded-full transition-all duration-500`}
          style={{ width: `${persen}%` }}
        />
      </div>
      <span className="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">
        {persen}%
      </span>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, unit, icon, iconBg, iconColor }: {
  label: string; value: string; unit: string;
  icon: React.ReactNode; iconBg: string; iconColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
      <div className={`${iconBg} ${iconColor} rounded-full p-2.5 sm:p-3 flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] sm:text-xs text-gray-400 font-medium mb-0.5 truncate">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800 leading-none">
          {value}{' '}
          <span className="text-xs sm:text-sm font-normal text-gray-400">{unit}</span>
        </p>
      </div>
    </div>
  );
}

// ─── Mobile Kategori Card ─────────────────────────────────────────────────────
function MobileKategoriCard({ row }: { row: KategoriRow }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className={`${row.iconBg} rounded-full p-1.5`}>{row.icon}</span>
        <span className="font-semibold text-sm text-gray-700">{row.label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Total Konsultasi</p>
          <p className="font-bold text-sm text-gray-700">{row.total.toLocaleString('id-ID')}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Presentasi Aktif</p>
          <ProgressBar persen={row.persen} color={row.barColor} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContainerTotalKonsultasi() {
  const [expanded, setExpanded] = useState(false);
  const { isCollapsed, isMobile } = useSidebar();

  const displayRows = expanded ? kategoriRows : kategoriRows.slice(0, 3);

  return (
    <div
      className={`
        flex-1 min-w-0 min-h-screen bg-[#EEF2F7]
        transition-all duration-300
        ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}
      `}
    >
      <div className="min-h-screen bg-[#f0f4fb] p-3 sm:p-4 md:p-6 font-sans">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Total Konsultasi</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Kelola  total Konsultasi</p>
          </div>

          {/* Date button */}
          <button className="
            self-start sm:self-auto
            flex items-center gap-2
            bg-white border border-blue-200 text-blue-600
            rounded-xl px-3 sm:px-4 py-2
            text-xs sm:text-sm font-medium shadow-sm
            hover:bg-blue-50 transition-colors whitespace-nowrap
          ">
            <Calendar size={14} className="text-blue-500 flex-shrink-0" />
            <span className="hidden sm:inline">Senin, 23 - Mei - 2026</span>
            <span className="sm:hidden">23 Mei 2026</span>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* ── Stat Cards ──
            mobile : 1 kolom
            sm     : 3 kolom
        ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatCard
            label="Total Konsultasi"
            value="1.250" unit="Konsultasi"
            icon={<MessageSquare size={20} />}
            iconBg="bg-green-100" iconColor="text-green-500"
          />
          <StatCard
            label="Konsultasi Selesai"
            value="1.250" unit="Konsultasi"
            icon={<Users size={20} />}
            iconBg="bg-blue-100" iconColor="text-blue-400"
          />
          <StatCard
            label="Konsultasi Dibatalkan"
            value="1.250" unit="Ahli"
            icon={<XCircle size={20} />}
            iconBg="bg-orange-100" iconColor="text-orange-400"
          />
        </div>

        {/* ── Tabel Kategori ── */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-4 sm:mb-5">
            Konsultasi Berdasarkan kategori
          </h2>

          {/* ── Mobile: card per baris ── */}
          <div className="flex flex-col gap-3 sm:hidden">
            {displayRows.map((row) => (
              <MobileKategoriCard key={row.label} row={row} />
            ))}
          </div>

          {/* ── Desktop: table ── */}
          <div className="hidden sm:block">
            {/* Header */}
            <div className="grid grid-cols-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100 pb-2 mb-1">
              <span>Kategori</span>
              <span>Total Konsultasi</span>
              <span>Presentasi Aktif</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {displayRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-3 items-center py-3 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  {/* Kategori */}
                  <div className="flex items-center gap-2">
                    <span className={`${row.iconBg} rounded-full p-1.5`}>{row.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{row.label}</span>
                  </div>

                  {/* Total */}
                  <span className="text-sm font-semibold text-gray-700">
                    {row.total.toLocaleString('id-ID')}
                  </span>

                  {/* Progress */}
                  <ProgressBar persen={row.persen} color={row.barColor} />
                </div>
              ))}
            </div>
          </div>

          {/* Toggle button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors"
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