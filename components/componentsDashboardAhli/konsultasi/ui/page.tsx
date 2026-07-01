'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, User, MessageCircle, Loader2 } from 'lucide-react';
import Header from './header/page';
import { supabase } from '@/utils/supabase/client';

// ─── Types ───────────────────────────────────────────────────
type StatusType = 'aktif' | 'menunggu' | 'selesai';
type FilterType = 'semua' | StatusType;

interface Konsultasi {
  id: string;
  user_id: string;
  nama: string;
  email: string;
  status: StatusType;
  waktu: string;
  db_status: string;
  photo_url: string | null; // ⬅️ foto profil user
}

// ─── Status Mapping dari DB → Display ────────────────────────
function mapStatus(dbStatus: string): StatusType {
  switch (dbStatus) {
    case 'confirmed':
    case 'ongoing':
      return 'aktif';
    case 'pending':
      return 'menunggu';
    case 'completed':
    case 'cancelled':
      return 'selesai';
    default:
      return 'menunggu';
  }
}

function formatWaktu(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' }) + ' | ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

// ─── Status Config ────────────────────────────────────────────
const STATUS_CONFIG: Record<StatusType, { label: string; pill: string; dot: string }> = {
  aktif: { label: 'Aktif', pill: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  menunggu: { label: 'Menunggu', pill: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  selesai: { label: 'Selesai', pill: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
};

const FILTER_OPTIONS: { value: FilterType; label: string; dot: string }[] = [
  { value: 'semua', label: 'Semua', dot: 'bg-gray-300' },
  { value: 'aktif', label: 'Aktif', dot: 'bg-green-500' },
  { value: 'menunggu', label: 'Menunggu', dot: 'bg-yellow-400' },
  { value: 'selesai', label: 'Selesai', dot: 'bg-gray-400' },
];

// ─── Avatar kecil (dipakai desktop & mobile) ───────────────────
function UserAvatar({ photoUrl, nama, size = 'w-7 h-7 lg:w-8 lg:h-8' }: { photoUrl: string | null; nama: string; size?: string }) {
  const [imgError, setImgError] = useState(false);
  const showPhoto = !!photoUrl && !imgError;

  return (
    <div className={`${size} rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden`}>
      {showPhoto ? <img src={photoUrl!} alt={nama} className="w-full h-full object-cover" onError={() => setImgError(true)} /> : <User size={13} strokeWidth={1.5} className="text-gray-400" />}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────
export default function ContainerKonsultasi() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();

  const [data, setData] = useState<Konsultasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('semua');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

    // ✅ Ambil ahli_profiles.id dulu
    const { data: ahliProfile } = await supabase.from('ahli_profiles').select('id').eq('user_id', session.user.id).eq('is_verified', true).maybeSingle();

    if (!ahliProfile) {
      setLoading(false);
      return;
    }

    // ✅ Ambil daftar konsultasi + data user (nama, email)
    const { data: konsultasi, error } = await supabase
      .from('consultations')
      .select(
        `
      id,
      user_id,
      status,
      created_at,
      scheduled_at,
      users!consultations_user_id_fkey(full_name, email)
    `,
      )
      .eq('ahli_id', ahliProfile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ContainerKonsultasi] Error fetch consultations:', error.message);
      setLoading(false);
      return;
    }

    if (!konsultasi || konsultasi.length === 0) {
      setData([]);
      setLoading(false);
      return;
    }

    // ✅ Ambil foto profil semua user yang muncul di daftar konsultasi (1 query batch)
    const userIds = [...new Set(konsultasi.map((item: any) => item.user_id).filter(Boolean))];

    let photoMap: Record<string, string | null> = {};
    if (userIds.length > 0) {
      const { data: profiles, error: profileErr } = await supabase.from('user_profiles').select('user_id, photo_url').in('user_id', userIds);

      if (profileErr) {
        console.error('[ContainerKonsultasi] Error fetch user_profiles (photo):', profileErr.message);
      }

      if (profiles) {
        photoMap = profiles.reduce((acc: Record<string, string | null>, p: any) => {
          acc[p.user_id] = p.photo_url ?? null;
          return acc;
        }, {});
      }
    }

    setData(
      konsultasi.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        nama: item.users?.full_name ?? 'User',
        email: item.users?.email ?? '',
        status: mapStatus(item.status),
        db_status: item.status,
        waktu: formatWaktu(item.created_at),
        photo_url: photoMap[item.user_id] ?? null,
      })),
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Close dropdown on outside click ────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Filter ──────────────────────────────────────────────────
  const filtered = data.filter((row) => {
    const matchFilter = filter === 'semua' || row.status === filter;
    const matchSearch = row.nama.toLowerCase().includes(search.toLowerCase()) || row.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const activeFilterLabel = filter === 'semua' ? 'Filter' : STATUS_CONFIG[filter as StatusType].label;

  function handleChat(id: string) {
    router.push(`/ahli/konsultasi/${id}/chat`);
  }

  // ── Empty & Loading State ────────────────────────────────────
  const EmptyRow = ({ colSpan }: { colSpan: number }) => (
    <tr>
      <td colSpan={colSpan} className="text-center py-14">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageCircle size={22} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-400">Belum ada konsultasi</p>
          <p className="text-xs text-gray-300">Data konsultasi akan muncul di sini</p>
        </div>
      </td>
    </tr>
  );

  const LoadingRow = ({ colSpan }: { colSpan: number }) => (
    <tr>
      <td colSpan={colSpan} className="text-center py-12">
        <div className="flex justify-center items-center gap-2 text-gray-400">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Memuat data...</span>
        </div>
      </td>
    </tr>
  );

  return (
    <div className={`flex-1 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        <Header />

        {/* Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          <div className="relative flex-1 sm:flex-none sm:w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 sm:py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border rounded-xl bg-white transition whitespace-nowrap select-none ${
                dropdownOpen || filter !== 'semua' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {filter !== 'semua' && <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[filter as StatusType].dot}`} />}
              {activeFilterLabel}
              <ChevronDown size={13} strokeWidth={2} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-[calc(100%+6px)] right-0 sm:left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 min-w-[140px] sm:min-w-[160px] flex flex-col gap-0.5">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilter(opt.value);
                      setDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm rounded-lg mx-1 transition ${filter === opt.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 ${opt.dot}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-4 sm:px-6 pt-4 sm:pt-5">
            <h2 className="text-sm sm:text-[15px] font-medium text-gray-900 pb-3 sm:pb-4 border-b-2 border-primary w-full inline-block">Daftar Konsultasi</h2>
          </div>

          {/* Desktop */}
          <div className="hidden sm:block">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="w-[25%] text-left text-xs font-medium text-gray-400 px-4 lg:px-6 py-3">User</th>
                  <th className="w-[28%] text-left text-xs font-medium text-gray-400 px-4 lg:px-6 py-3">Email</th>
                  <th className="w-[17%] text-left text-xs font-medium text-gray-400 px-4 lg:px-6 py-3">Status</th>
                  <th className="w-[18%] text-left text-xs font-medium text-gray-400 px-4 lg:px-6 py-3">Waktu</th>
                  <th className="w-[12%] text-right text-xs font-medium text-gray-400 px-4 lg:px-6 py-3">Aksi</th>
                </tr>
              </thead>
            </table>

            <div className="max-h-[372px] overflow-y-auto">
              <table className="w-full text-sm table-fixed">
                <tbody>
                  {loading ? (
                    <LoadingRow colSpan={5} />
                  ) : filtered.length === 0 ? (
                    <EmptyRow colSpan={5} />
                  ) : (
                    filtered.map((row) => {
                      const cfg = STATUS_CONFIG[row.status];
                      return (
                        <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="w-[25%] px-4 lg:px-6 py-3">
                            <div className="flex items-center gap-2 lg:gap-2.5">
                              <UserAvatar photoUrl={row.photo_url} nama={row.nama} />
                              <span className="font-medium text-gray-800 text-xs lg:text-sm truncate">{row.nama}</span>
                            </div>
                          </td>
                          <td className="w-[28%] px-4 lg:px-6 py-3 text-gray-500 text-xs lg:text-sm truncate">{row.email}</td>
                          <td className="w-[17%] px-4 lg:px-6 py-3">
                            <span className={`inline-flex items-center gap-1 lg:gap-1.5 px-2 lg:px-2.5 py-1 rounded-full text-[11px] lg:text-xs font-medium ${cfg.pill}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="w-[18%] px-4 lg:px-6 py-3 text-gray-400 text-[11px] lg:text-xs">{row.waktu}</td>
                          <td className="w-[12%] px-4 lg:px-6 py-3 text-right">
                            {row.status !== 'selesai' && (
                              <button
                                onClick={() => handleChat(row.id)}
                                className="inline-flex items-center gap-1 lg:gap-1.5 px-2.5 lg:px-3.5 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-[11px] lg:text-xs font-medium rounded-full transition-colors active:scale-95"
                              >
                                <MessageCircle size={11} strokeWidth={2} />
                                Chat
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile */}
          <div className="sm:hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12 gap-2 text-gray-400">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Memuat data...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageCircle size={20} className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-400 font-medium">Belum ada konsultasi</p>
              </div>
            ) : (
              <div className="max-h-[440px] overflow-y-auto divide-y divide-gray-100">
                {filtered.map((row) => {
                  const cfg = STATUS_CONFIG[row.status];
                  return (
                    <div key={row.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <UserAvatar photoUrl={row.photo_url} nama={row.nama} size="w-9 h-9" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{row.nama}</p>
                          <p className="text-xs text-gray-500 truncate">{row.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.pill}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                            <span className="text-[10px] text-gray-400">{row.waktu}</span>
                          </div>
                        </div>
                      </div>
                      {row.status !== 'selesai' && (
                        <button
                          onClick={() => handleChat(row.id)}
                          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium rounded-full transition-colors active:scale-95"
                        >
                          <MessageCircle size={11} strokeWidth={2} />
                          Chat
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
