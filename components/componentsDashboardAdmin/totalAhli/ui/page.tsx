'use client';

import { useState, useRef, useEffect } from 'react';
import { Stethoscope, UserPlus, UserCheck, Activity, Calendar, ChevronDown, ChevronUp, BadgeCheck } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { supabase } from '@/utils/supabase/client';

// ─── Types ────────────────────────────────────────────────────
interface Props {
  totalAhli: number;
  ahliBaru: number;
  ahliVerified: number;
  rataRataAktivitas: number;
  persenBaru: number;
  persenVerified: number;
}

// ─── Bulan Indonesia ──────────────────────────────────────────
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function formatTanggal(date: Date) {
  return `${HARI[date.getDay()]}, ${date.getDate()} - ${BULAN[date.getMonth()]} - ${date.getFullYear()}`;
}

// ─── Progress Bar ─────────────────────────────────────────────
function ProgressBar({ persen, color, slim = false }: { persen: number; color: string; slim?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${slim ? 'w-16' : 'w-16 sm:w-24 md:w-28'} h-2 bg-gray-100 rounded-full overflow-hidden`}>
        <div className={`${color} h-full rounded-full transition-all duration-700`} style={{ width: `${Math.min(persen, 100)}%` }} />
      </div>
      <span className="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">{persen}%</span>
    </div>
  );
}

// ─── Mobile Card Row ──────────────────────────────────────────
function MobileRow({ row }: { row: { label: string; icon: React.ReactNode; iconBg: string; total: number; aktif: number; persen: number; barColor: string } }) {
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
          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Persentase</p>
          <ProgressBar persen={row.persen} color={row.barColor} slim />
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Table Row ────────────────────────────────────────
function DesktopRow({ row }: { row: { label: string; icon: React.ReactNode; iconBg: string; total: number; aktif: number; persen: number; barColor: string } }) {
  return (
    <div className="grid grid-cols-4 items-center py-3 text-sm text-gray-700 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-xl transition-colors px-2">
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

// ─── Main Component ───────────────────────────────────────────
export default function ContainerTotalAhli({ totalAhli: initTotal, ahliBaru: initBaru, ahliVerified: initVerified, rataRataAktivitas: initRata, persenBaru: initPersenBaru, persenVerified: initPersenVerified }: Props) {
  const { isCollapsed, isMobile } = useSidebar();
  const [expanded, setExpanded] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [activeDate] = useState(new Date());
  const dateRef = useRef<HTMLDivElement>(null);

  // ── State ────────────────────────────────────────────────────
  const [totalAhli, setTotalAhli] = useState(initTotal);
  const [ahliBaru, setAhliBaru] = useState(initBaru);
  const [ahliVerified, setAhliVerified] = useState(initVerified);
  const [rataRata, setRataRata] = useState(initRata);
  const [persenBaru, setPersenBaru] = useState(initPersenBaru);
  const [persenVerified, setPersenVerified] = useState(initPersenVerified);

  // ── Close dropdown on outside click ──────────────────────────
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setDateOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  // ── Refetch via API route ─────────────────────────────────────
  const refetchCounts = async () => {
    try {
      const res = await fetch('/api/total-ahli');
      const data = await res.json();
      setTotalAhli(data.totalAhli);
      setAhliBaru(data.ahliBaru);
      setAhliVerified(data.ahliVerified);
      setRataRata(data.rataRataAktivitas);
      setPersenBaru(data.persenBaru);
      setPersenVerified(data.persenVerified);
    } catch (err) {
      console.error('Gagal fetch data ahli:', err);
    }
  };

  // ── Supabase Realtime ─────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('total-ahli-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        refetchCounts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ahli_profiles' }, () => {
        refetchCounts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── Stat Cards ───────────────────────────────────────────────
  const STATS = [
    {
      label: 'Total Ahli',
      value: totalAhli,
      unit: 'Ahli',
      icon: <Stethoscope size={20} />,
      color: 'bg-green-100',
      iconColor: 'text-green-500',
      valueColor: 'text-green-500',
    },
    {
      label: 'Ahli Baru',
      value: ahliBaru,
      unit: 'Bulan ini',
      icon: <UserPlus size={20} />,
      color: 'bg-blue-100',
      iconColor: 'text-blue-400',
      valueColor: 'text-blue-500',
    },
    {
      label: 'Ahli Terverifikasi',
      value: ahliVerified,
      unit: 'Terverifikasi',
      icon: <BadgeCheck size={20} />,
      color: 'bg-orange-100',
      iconColor: 'text-orange-400',
      valueColor: 'text-orange-500',
    },
    {
      label: 'Rata-rata Verifikasi',
      value: rataRata,
      unit: '% dari total',
      icon: <Activity size={20} />,
      color: 'bg-purple-100',
      iconColor: 'text-purple-400',
      valueColor: 'text-purple-500',
    },
  ];

  // ── Table Rows ───────────────────────────────────────────────
  const TABLE_ROWS = [
    {
      label: 'Total Ahli',
      icon: <Stethoscope size={16} />,
      iconBg: 'bg-green-100 text-green-500',
      total: totalAhli,
      aktif: ahliVerified,
      persen: persenVerified,
      barColor: 'bg-green-400',
    },
    {
      label: 'Ahli Baru',
      icon: <UserPlus size={16} />,
      iconBg: 'bg-orange-100 text-orange-400',
      total: ahliBaru,
      aktif: ahliBaru,
      persen: persenBaru,
      barColor: 'bg-orange-400',
    },
    {
      label: 'Ahli Terverifikasi',
      icon: <UserCheck size={16} />,
      iconBg: 'bg-blue-100 text-blue-400',
      total: totalAhli,
      aktif: ahliVerified,
      persen: persenVerified,
      barColor: 'bg-blue-500',
    },
  ];

  const displayRows = expanded ? TABLE_ROWS : TABLE_ROWS.slice(0, 3);

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-3 sm:p-4 md:p-6 lg:p-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6 mt-8 sm:mt-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Total Ahli</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Kelola informasi Ahli Gizi</p>
          </div>

          {/* Date badge */}
          <div className="relative flex-shrink-0 self-start sm:self-auto" ref={dateRef}>
            <button
              onClick={() => setDateOpen((o) => !o)}
              className="flex items-center gap-2 bg-white border border-blue-200 text-blue-600 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium shadow-sm hover:bg-blue-50 transition-colors w-full sm:w-auto whitespace-nowrap"
            >
              <Calendar size={14} className="text-blue-500 flex-shrink-0" />
              <span className="sm:hidden">
                {activeDate.getDate()} {BULAN[activeDate.getMonth()]} {activeDate.getFullYear()}
              </span>
              <span className="hidden sm:inline">{formatTanggal(activeDate)}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${dateOpen ? 'rotate-180' : ''}`} />
            </button>
            {dateOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-56 text-sm text-gray-500">
                <p className="font-semibold text-gray-700 mb-1">Tanggal aktif</p>
                <p>{formatTanggal(activeDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {STATS.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
              <div className={`${card.color} ${card.iconColor} rounded-full p-2.5 sm:p-3 flex-shrink-0`}>{card.icon}</div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs text-gray-400 font-medium mb-0.5 truncate">{card.label}</p>
                <p className={`text-xl sm:text-2xl font-bold ${card.valueColor} leading-none`}>{card.label === 'Rata-rata Verifikasi' ? `${card.value}%` : card.value.toLocaleString('id-ID')}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{card.unit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Ringkasan Ahli ── */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-4 sm:mb-5">Ringkasan Ahli</h2>

          {/* Mobile */}
          <div className="flex flex-col gap-3 sm:hidden">
            {displayRows.map((row) => (
              <MobileRow key={row.label} row={row} />
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-4 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100 pb-2 mb-1 px-2">
              <span>Segmentasi</span>
              <span className="text-center">Total Ahli</span>
              <span className="text-center">Ahli Aktif</span>
              <span className="text-center">Persentase Aktif</span>
            </div>
            <div>
              {displayRows.map((row) => (
                <DesktopRow key={row.label} row={row} />
              ))}
            </div>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mt-4">
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors">
              {expanded ? 'Sembunyikan' : 'Lihat Selengkapnya'}
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
