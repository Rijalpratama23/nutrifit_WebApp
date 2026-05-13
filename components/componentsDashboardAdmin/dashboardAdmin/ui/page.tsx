'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { Users, Phone, ClipboardList, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Props {
  totalPengguna: number;
  totalAhli: number;
  totalKonsultasi: number;
  totalArtikel: number;
}

// ─── Donut Chart (sama seperti sebelumnya) ────────────────────
function DonutChart({ data }: { data: { pct: number; color: string }[] }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const R = 72;
  const r = 44;
  const total = data.reduce((s, d) => s + d.pct, 0) || 1;
  const grandTotal = data.reduce((s, d) => s + d.pct, 0);

  type Arc = { d: string; color: string };
  const arcs: Arc[] = [];
  let startAngle = -90;

  data.forEach((item) => {
    const angle = (item.pct / total) * 360;
    const endAngle = startAngle + angle;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = cx + R * Math.cos(toRad(startAngle));
    const y1 = cy + R * Math.sin(toRad(startAngle));
    const x2 = cx + R * Math.cos(toRad(endAngle));
    const y2 = cy + R * Math.sin(toRad(endAngle));
    const ix1 = cx + r * Math.cos(toRad(endAngle));
    const iy1 = cy + r * Math.sin(toRad(endAngle));
    const ix2 = cx + r * Math.cos(toRad(startAngle));
    const iy2 = cy + r * Math.sin(toRad(startAngle));
    const largeArc = angle > 180 ? 1 : 0;
    const d = [`M ${x1} ${y1}`, `A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`, `L ${ix1} ${iy1}`, `A ${r} ${r} 0 ${largeArc} 0 ${ix2} ${iy2}`, 'Z'].join(' ');
    arcs.push({ d, color: item.color });
    startAngle = endAngle;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0 drop-shadow-md">
      {arcs.map((arc, i) => (
        <path key={i} d={arc.d} fill={arc.color} stroke="white" strokeWidth="2" />
      ))}
      <text x={cx} y={cy - 8} textAnchor="middle" className="fill-gray-500" style={{ fontSize: 11, fontWeight: 500 }}>
        Total
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="fill-gray-800" style={{ fontSize: 22, fontWeight: 700 }}>
        {grandTotal}
      </text>
    </svg>
  );
}

export default function ContainerDashboardAdmin({ totalPengguna, totalAhli, totalKonsultasi, totalArtikel }: Props) {
  const { isCollapsed, isMobile } = useSidebar();

  // ── Data dinamis ──────────────────────────────────────────
  const STATS = [
    {
      label: 'Pengguna',
      value: totalPengguna,
      unit: 'Users',
      href: '/admin/totalPengguna',
      icon: <Users size={26} strokeWidth={1.8} />,
      bg: 'bg-secondary',
      iconBg: 'bg-green-600',
      textColor: 'text-white',
      linkColor: 'text-green-100 hover:text-white',
      border: 'border-green-400',
    },
    {
      label: 'Ahli',
      value: totalAhli,
      unit: 'Ahli',
      href: '/admin/totalAhli',
      icon: <Phone size={26} strokeWidth={1.8} />,
      bg: 'bg-primary',
      iconBg: 'bg-blue-600',
      textColor: 'text-white',
      linkColor: 'text-blue-100 hover:text-white',
      border: 'border-blue-500',
    },
    {
      label: 'Konsultasi',
      value: totalKonsultasi,
      unit: 'Konsultasi',
      href: '/admin/totalKonsultasi',
      icon: <ClipboardList size={26} strokeWidth={1.8} />,
      bg: 'bg-orange-500',
      iconBg: 'bg-orange-600',
      textColor: 'text-white',
      linkColor: 'text-orange-100 hover:text-white',
      border: 'border-orange-400',
    },
    {
      label: 'Publish',
      value: totalArtikel,
      unit: 'Artikel',
      href: '/admin/artikel',
      icon: <FileText size={26} strokeWidth={1.8} />,
      bg: 'bg-white',
      iconBg: 'bg-blue-60',
      textColor: 'text-gray-800',
      linkColor: 'text-blue-600 hover:text-blue-700',
      border: 'border-gray-200',
    },
  ];

  const grandTotal = totalPengguna + totalAhli + totalKonsultasi + totalArtikel;

  const CHART_DATA = [
    { label: 'Total Pengguna', value: totalPengguna, pct: totalPengguna, color: '#22c55e', iconBg: 'bg-green-100', iconColor: 'text-green-600', icon: <Users size={16} /> },
    { label: 'Total Ahli', value: totalAhli, pct: totalAhli, color: '#2563eb', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', icon: <Phone size={16} /> },
    { label: 'Total Konsultasi', value: totalKonsultasi, pct: totalKonsultasi, color: '#f97316', iconBg: 'bg-orange-100', iconColor: 'text-orange-500', icon: <ClipboardList size={16} /> },
    { label: 'Total Publish Artikel', value: totalArtikel, pct: totalArtikel, color: '#1e293b', iconBg: 'bg-slate-100', iconColor: 'text-slate-700', icon: <FileText size={16} /> },
  ];

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 mt-5 sm:mt-0">
          <h1 className="text-2xl sm:text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Kelola user &amp; Filter User</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {STATS.map((card) => (
            <div key={card.label} className={`rounded-2xl border ${card.border} ${card.bg} p-4 sm:p-5 flex flex-col gap-3 shadow-sm`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm sm:text-[15px] font-semibold ${card.textColor}`}>{card.label}</span>
                <div className={`${card.iconBg} p-2 rounded-lg ${card.textColor}`}>{card.icon}</div>
              </div>
              <div className={`text-3xl sm:text-4xl font-bold ${card.textColor} leading-none`}>
                {card.value.toLocaleString()}
                <span className={`text-xs sm:text-sm font-medium ml-1.5 opacity-80`}>{card.unit}</span>
              </div>
              <Link href={card.href} className={`text-xs sm:text-sm font-medium transition-colors ${card.linkColor}`}>
                Lihat Semua
              </Link>
            </div>
          ))}
        </div>

        {/* Activity Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} className="text-gray-500" />
            <h2 className="text-base sm:text-lg font-bold text-gray-800">Semua Kegiatan</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
            <DonutChart data={CHART_DATA} />
            <div className="flex flex-col justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              {CHART_DATA.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div className={`p-1.5 rounded-md ${item.iconBg} ${item.iconColor} flex-shrink-0`}>{item.icon}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-700 leading-tight">{item.label}</p>
                    <p className="text-xs text-gray-400">
                      {item.value} ({grandTotal > 0 ? ((item.value / grandTotal) * 100).toFixed(1) : 0}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
