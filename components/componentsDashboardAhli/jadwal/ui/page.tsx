'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { Calendar, MessageCircle, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@/hooks/useUser';
import HeadJadwal from './head/page';


type StatusJadwal = 'hari_ini' | 'besok' | 'selesai';
type FilterType = 'semua' | StatusJadwal;

interface Jadwal {
  id: string;
  nama: string;
  email: string;
  tanggal: string;
  status: StatusJadwal;
  db_status: string;
}

// ─── Status Config ────────────────────────────────────────────
const STATUS_CONFIG: Record<StatusJadwal, { label: string; pill: string }> = {
  hari_ini: { label: 'Hari ini', pill: 'bg-orange-100 text-orange-600' },
  besok: { label: 'Besok', pill: 'bg-blue-100 text-blue-600' },
  selesai: { label: 'Selesai', pill: 'bg-gray-100 text-gray-500' },
};

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'semua', label: 'Semua' },
  { value: 'hari_ini', label: 'Hari ini' },
  { value: 'besok', label: 'Besok' },
  { value: 'selesai', label: 'Selesai' },
];

// ─── Helpers ─────────────────────────────────────────────────
function toDateOnly(date: Date): string {
  return date.toISOString().split('T')[0];
}

function mapStatus(dbStatus: string, scheduledAt: string | null): StatusJadwal {
  if (dbStatus === 'completed') return 'selesai';

  if (scheduledAt) {
    const schedDate = toDateOnly(new Date(scheduledAt));
    const today = toDateOnly(new Date());
    const tomorrow = toDateOnly(new Date(Date.now() + 86400000));
    if (schedDate === tomorrow) return 'besok';
    if (schedDate <= today) return 'hari_ini';
    return 'besok';
  }

  return 'hari_ini';
}

function formatTanggal(dateStr: string | null): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]}`;
}

function AvatarIcon({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
  const ico = size === 'sm' ? 18 : 22;
  return (
    <div className={`${dim} rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0`}>
      <svg width={ico} height={ico} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill="#9ca3af" />
        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────
export default function ContainerJadwal() {
  const { isCollapsed, isMobile } = useSidebar();
  const { user } = useUser();
  const router = useRouter();

  const [data, setData] = useState<Jadwal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('semua');

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
        status,
        scheduled_at,
        created_at,
        users!consultations_user_id_fkey(full_name, email)
      `,
      )
      .eq('ahli_id', session.user.id)
      .in('status', ['confirmed', 'ongoing', 'completed'])
      .order('scheduled_at', { ascending: true, nullsFirst: false });

    if (!error && konsultasi) {
      setData(
        konsultasi.map((item: any) => ({
          id: item.id,
          nama: item.users?.full_name ?? 'User',
          email: item.users?.email ?? '',
          tanggal: formatTanggal(item.scheduled_at ?? item.created_at),
          status: mapStatus(item.status, item.scheduled_at),
          db_status: item.status,
        })),
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Filter ──────────────────────────────────────────────────
  const filtered = data.filter((item) => (activeFilter === 'semua' ? true : item.status === activeFilter));

  function handleChat(id: string) {
    router.push(`/ahli/jadwal/${id}/chat`);
  }

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        {/* Header */}
        <HeadJadwal />

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-4 sm:mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 border
                ${activeFilter === f.value ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Card List */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 flex justify-center items-center gap-2 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Memuat jadwal...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar size={22} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-400">Tidak ada jadwal</p>
              <p className="text-xs text-gray-300">Jadwal konsultasi akan muncul di sini</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((item) => {
              const cfg = STATUS_CONFIG[item.status];
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-150">
                  {/* Desktop */}
                  <div className="hidden sm:flex items-center gap-3 lg:gap-4 px-4 sm:px-5 lg:px-6 py-4">
                    <AvatarIcon />

                    {/* Nama + email */}
                    <div className="min-w-0 w-[130px] lg:w-[160px] flex-shrink-0">
                      <p className="text-[13px] lg:text-[13.5px] font-semibold text-gray-800 truncate">{item.nama}</p>
                      <p className="text-[10px] lg:text-[11px] text-gray-400 truncate">{item.email}</p>
                    </div>

                    {/* Status DB */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] lg:text-[13px] font-medium text-gray-700">Konsultasi</p>
                      <p className="text-[10px] lg:text-[11px] text-gray-400 capitalize">{item.db_status}</p>
                    </div>

                    {/* Tanggal */}
                    <div className="hidden md:flex items-center gap-1.5 text-gray-500 flex-shrink-0 min-w-[120px]">
                      <Calendar size={13} className="text-gray-400 flex-shrink-0" strokeWidth={1.8} />
                      <span className="text-[11px] lg:text-[12px] whitespace-nowrap">{item.tanggal}</span>
                    </div>

                    {/* Status pill */}
                    <span className={`flex-shrink-0 text-[10px] lg:text-[11px] font-medium px-2 lg:px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.pill}`}>{cfg.label}</span>

                    {/* Chat button — hanya jika belum selesai */}
                    {item.status !== 'selesai' ? (
                      <button
                        onClick={() => handleChat(item.id)}
                        className="flex-shrink-0 flex items-center gap-1 lg:gap-1.5 px-3 lg:px-3.5 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-[11px] lg:text-xs font-medium rounded-full transition-colors active:scale-95"
                      >
                        <MessageCircle size={11} strokeWidth={2} />
                        chat
                      </button>
                    ) : (
                      <div className="w-[60px]" />
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="sm:hidden px-4 py-3.5">
                    <div className="flex items-center gap-3 mb-2">
                      <AvatarIcon size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800 truncate">{item.nama}</p>
                        <p className="text-[11px] text-gray-400 truncate">{item.email}</p>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full ${cfg.pill}`}>{cfg.label}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pl-12">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-gray-600 truncate">Konsultasi · {item.db_status}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Calendar size={10} className="text-gray-400 flex-shrink-0" strokeWidth={1.8} />
                          <span className="text-[10px] text-gray-400">{item.tanggal}</span>
                        </div>
                      </div>
                      {item.status !== 'selesai' && (
                        <button
                          onClick={() => handleChat(item.id)}
                          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-[11px] font-medium rounded-full transition-colors active:scale-95"
                        >
                          <MessageCircle size={10} strokeWidth={2} />
                          chat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
