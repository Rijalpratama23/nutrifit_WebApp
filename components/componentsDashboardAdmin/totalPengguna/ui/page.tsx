'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { supabase } from '@/utils/supabase/client';
import { Users, UserPlus, UserCheck, Activity, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────
interface Props {
  totalPengguna: number;
  penggunaBaru: number;
  penggunaAktif: number;
  rataRataAktivitas: number;
  persenBaru: number;
  persenAktif: number;
}

// ─── Bulan Indonesia ─────────────────────────────────────────
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function formatTanggal(date: Date) {
  return `${HARI[date.getDay()]}, ${date.getDate()} - ${BULAN[date.getMonth()]} - ${date.getFullYear()}`;
}

// ─── Progress Bar ─────────────────────────────────────────────
function ProgressBar({ persen, barColor }: { persen: number; barColor: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[60px] sm:min-w-[80px]">
        <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{ width: `${Math.min(persen, 100)}%` }} />
      </div>
      <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">{persen}%</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────
export default function ContainerTotalPengguna({ totalPengguna: initTotal, penggunaBaru: initBaru, penggunaAktif: initAktif, rataRataAktivitas: initRata, persenBaru: initPersenBaru, persenAktif: initPersenAktif }: Props) {
  const { isCollapsed, isMobile } = useSidebar();
  const [expanded, setExpanded] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [activeDate] = useState(new Date());
  const dateRef = useRef<HTMLDivElement>(null);

  // ── State data ───────────────────────────────────────────────
  const [totalPengguna, setTotalPengguna] = useState(initTotal);
  const [penggunaBaru, setPenggunaBaru] = useState(initBaru);
  const [penggunaAktif, setPenggunaAktif] = useState(initAktif);
  const [rataRata, setRataRata] = useState(initRata);
  const [persenBaru, setPersenBaru] = useState(initPersenBaru);
  const [persenAktif, setPersenAktif] = useState(initPersenAktif);

  // ── Close date dropdown on outside click ──────────────────────
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setDateOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  // ── Refetch dari API route (bypass RLS) ──────────────────────
  const refetchCounts = async () => {
    try {
      const res = await fetch('/api/total-pengguna');
      const data = await res.json();
      setTotalPengguna(data.totalPengguna);
      setPenggunaBaru(data.penggunaBaru);
      setPenggunaAktif(data.penggunaAktif);
      setRataRata(data.rataRataAktivitas);
      setPersenBaru(data.persenBaru);
      setPersenAktif(data.persenAktif);
    } catch (err) {
      console.error('Gagal fetch data pengguna:', err);
    }
  };

  // ── Supabase Realtime ────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('total-pengguna-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
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
      label: 'Total Pengguna',
      value: totalPengguna,
      unit: 'Pengguna',
      icon: <Users size={22} strokeWidth={1.8} />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-green-500',
    },
    {
      label: 'Pengguna Baru',
      value: penggunaBaru,
      unit: 'Bulan ini',
      icon: <UserPlus size={22} strokeWidth={1.8} />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      valueColor: 'text-blue-500',
    },
    {
      label: 'Pengguna Aktif',
      value: penggunaAktif,
      unit: '30 hari terakhir',
      icon: <UserCheck size={22} strokeWidth={1.8} />,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-500',
      valueColor: 'text-orange-500',
    },
    {
      label: 'Rata-rata Aktivitas',
      value: rataRata,
      unit: '% dari total',
      icon: <Activity size={22} strokeWidth={1.8} />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      valueColor: 'text-purple-500',
    },
  ];

  // ── Table Rows ───────────────────────────────────────────────
  const TABLE_ROWS = [
    {
      segmen: 'Semua Pengguna',
      icon: <Users size={16} strokeWidth={1.8} />,
      iconBg: 'bg-green-100 text-green-600',
      total: totalPengguna,
      aktif: penggunaAktif,
      persen: persenAktif,
      barColor: 'bg-green-500',
    },
    {
      segmen: 'Pengguna Baru',
      icon: <UserPlus size={16} strokeWidth={1.8} />,
      iconBg: 'bg-orange-100 text-orange-500',
      total: penggunaBaru,
      aktif: penggunaBaru,
      persen: persenBaru,
      barColor: 'bg-orange-400',
    },
    {
      segmen: 'Pengguna Aktif',
      icon: <UserCheck size={16} strokeWidth={1.8} />,
      iconBg: 'bg-blue-100 text-blue-500',
      total: totalPengguna,
      aktif: penggunaAktif,
      persen: persenAktif,
      barColor: 'bg-blue-600',
    },
  ];

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

          {/* Date badge */}
          <div className="relative flex-shrink-0 self-start sm:self-auto" ref={dateRef}>
            <button onClick={() => setDateOpen((o) => !o)} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors">
              <Calendar size={16} className="text-blue-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{formatTanggal(activeDate)}</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${dateOpen ? 'rotate-180' : ''}`} />
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {STATS.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
              <div className={`p-2.5 sm:p-3 rounded-full ${card.iconBg} ${card.iconColor} flex-shrink-0`}>{card.icon}</div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 font-medium leading-tight truncate">{card.label}</p>
                <p className={`text-xl sm:text-2xl font-bold ${card.valueColor} leading-tight mt-0.5`}>{card.label === 'Rata-rata Aktivitas' ? `${card.value}%` : card.value.toLocaleString('id-ID')}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{card.unit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Ringkasan Pengguna Card ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">Ringkasan Pengguna</h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-[30%]">Segmentasi</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-[20%]">Total Pengguna</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-[20%]">Pengguna Aktif</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-[30%]">Persentase Aktif</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`p-1.5 rounded-full ${row.iconBg}`}>{row.icon}</span>
                        <span className="font-medium text-gray-800">{row.segmen}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{row.total.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{row.aktif.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <ProgressBar persen={row.persen} barColor={row.barColor} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="sm:hidden divide-y divide-gray-100">
            {visibleRows.map((row, i) => (
              <div key={i} className="px-4 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`p-1.5 rounded-full ${row.iconBg}`}>{row.icon}</span>
                  <span className="font-semibold text-gray-800 text-sm">{row.segmen}</span>
                </div>
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
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Persentase Aktif</p>
                  <ProgressBar persen={row.persen} barColor={row.barColor} />
                </div>
              </div>
            ))}
          </div>

          {/* Lihat Selengkapnya */}
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
