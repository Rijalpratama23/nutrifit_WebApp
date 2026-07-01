'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { useState, useEffect, useCallback } from 'react';
import HeaderPermin from './header/page';
import HeadT from './headT/page';
import Hr from './hr/page';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';
import { Loader2, X, User, Ruler, Weight, Activity, Target, Leaf, AlertCircle, FileText } from 'lucide-react';

type Permintaan = {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  waktu: string;
  scheduled_at: string | null;
  keluhan: string | null;
  photo_url: string | null; // ⬅️ foto profil user
};

interface UserProfileDetail {
  full_name: string;
  age: number | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: string | null;
  goal: string | null;
  target_fitness: string | null;
  target_weight_kg: number | null;
  diet_type: string | null;
}

const COL = {
  user: 'w-[30%] px-6 py-3',
  tujuan: 'w-[30%] px-4 py-3',
  waktu: 'w-[20%] px-4 py-3',
  aksi: 'w-[20%] px-6 py-3',
};

function formatWaktu(dateStr: string) {
  const d = new Date(dateStr);
  const tgl = d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${tgl} | ${jam}`;
}

function hitungBMI(h?: number | null, w?: number | null): string {
  if (!h || !w) return '-';
  return (w / Math.pow(h / 100, 2)).toFixed(1);
}

function kategoriBMI(bmi: string) {
  const val = parseFloat(bmi);
  if (isNaN(val)) return { label: '-', color: 'text-gray-400' };
  if (val < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
  if (val < 25) return { label: 'Normal', color: 'text-green-600' };
  if (val < 30) return { label: 'Overweight', color: 'text-yellow-500' };
  return { label: 'Obesitas', color: 'text-red-500' };
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-700 truncate">{value || '-'}</p>
      </div>
    </div>
  );
}

// ─── Avatar kecil di tabel — hanya tampilan, foto asli atau fallback ikon ───
function UserAvatar({ photoUrl, nama, size = 'w-8 h-8' }: { photoUrl: string | null; nama: string; size?: string }) {
  const [imgError, setImgError] = useState(false);
  const showPhoto = !!photoUrl && !imgError;

  return (
    <div className={`${size} rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden`}>
      {showPhoto ? (
        <img src={photoUrl!} alt={nama} className="w-full h-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill="#9e9e9e" />
          <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

function ModalProfilUser({ isOpen, onClose, permintaan }: { isOpen: boolean; onClose: () => void; permintaan: Permintaan | null }) {
  const [profile, setProfile] = useState<UserProfileDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !permintaan) return;
    const fetchUserProfile = async () => {
      setLoading(true);
      const [{ data: userData }, { data: profileData }] = await Promise.all([
        supabase.from('users').select('full_name').eq('id', permintaan.user_id).single(),
        supabase.from('user_profiles').select('age, gender, height_cm, weight_kg, activity_level, goal, target_fitness, target_weight_kg, diet_type').eq('user_id', permintaan.user_id).single(),
      ]);
      setProfile({
        full_name: userData?.full_name ?? permintaan.user_name,
        age: profileData?.age ?? null,
        gender: profileData?.gender ?? null,
        height_cm: profileData?.height_cm ?? null,
        weight_kg: profileData?.weight_kg ?? null,
        activity_level: profileData?.activity_level ?? null,
        goal: profileData?.goal ?? null,
        target_fitness: profileData?.target_fitness ?? null,
        target_weight_kg: profileData?.target_weight_kg ?? null,
        diet_type: profileData?.diet_type ?? null,
      });
      setLoading(false);
    };
    fetchUserProfile();
  }, [isOpen, permintaan]);

  if (!isOpen || !permintaan) return null;

  const bmi = hitungBMI(profile?.height_cm, profile?.weight_kg);
  const { label: bmiLabel, color: bmiColor } = kategoriBMI(bmi);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-800">Profil User</h2>
            <p className="text-xs text-gray-400 mt-0.5">Data & keluhan yang diajukan</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{profile?.full_name}</p>
                    <p className="text-xs text-gray-500">
                      {profile?.gender ?? 'Gender belum diisi'} · {profile?.age ? `${profile.age} tahun` : 'Usia belum diisi'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Tinggi</p>
                    <p className="text-base font-bold text-gray-800">{profile?.height_cm ?? '-'}</p>
                    <p className="text-[9px] text-gray-400">cm</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Berat</p>
                    <p className="text-base font-bold text-gray-800">{profile?.weight_kg ?? '-'}</p>
                    <p className="text-[9px] text-gray-400">kg</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase">BMI</p>
                    <p className={`text-base font-bold ${bmiColor}`}>{bmi}</p>
                    <p className={`text-[9px] ${bmiColor}`}>{bmiLabel}</p>
                  </div>
                </div>
                <InfoRow icon={<Activity size={13} />} label="Level Aktivitas" value={profile?.activity_level ?? '-'} />
                <InfoRow icon={<Target size={13} />} label="Tujuan Utama" value={profile?.goal ?? '-'} />
                <InfoRow icon={<Ruler size={13} />} label="Target Kebugaran" value={profile?.target_fitness ?? '-'} />
                <InfoRow icon={<Weight size={13} />} label="Target Berat" value={profile?.target_weight_kg ? `${profile.target_weight_kg} kg` : '-'} />
                <InfoRow icon={<Leaf size={13} />} label="Pola Makan" value={profile?.diet_type ?? '-'} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-orange-400 rounded-full" />
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Keluhan yang Diajukan</h3>
                </div>
                {permintaan.keluhan ? (
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 leading-relaxed">{permintaan.keluhan}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <AlertCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <p className="text-xs text-gray-400">User tidak mengisi keluhan</p>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-400">Diajukan pada {permintaan.waktu}</p>
              </div>
            </>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="w-full px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContainerPermintaan() {
  const { isCollapsed, isMobile } = useSidebar();
  const [data, setData] = useState<Permintaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [ahliId, setAhliId] = useState<string | null>(null);
  const [selectedPermintaan, setSelectedPermintaan] = useState<Permintaan | null>(null);
  const [showModalProfil, setShowModalProfil] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const { data: ahliProfile } = await supabase.from('ahli_profiles').select('id').eq('user_id', session.user.id).eq('is_verified', true).maybeSingle();

    if (!ahliProfile) {
      setLoading(false);
      return;
    }

    setAhliId(ahliProfile.id);

    const { data: konsultasi, error } = await supabase
      .from('consultations')
      .select(
        `
        id, user_id, created_at, scheduled_at, keluhan,
        users!consultations_user_id_fkey(full_name, email)
      `,
      )
      .eq('ahli_id', ahliProfile.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      showErrorToast({ title: 'Gagal', message: 'Gagal memuat data permintaan.' });
      setLoading(false);
      return;
    }

    const list = konsultasi ?? [];

    // ✅ Ambil foto profil semua user yang muncul di daftar (1 query batch)
    const userIds = [...new Set(list.map((item: any) => item.user_id).filter(Boolean))];
    let photoMap: Record<string, string | null> = {};

    if (userIds.length > 0) {
      const { data: profiles, error: profileErr } = await supabase.from('user_profiles').select('user_id, photo_url').in('user_id', userIds);

      if (profileErr) {
        console.error('[ContainerPermintaan] Error fetch user_profiles (photo):', profileErr.message);
      }

      if (profiles) {
        photoMap = profiles.reduce((acc: Record<string, string | null>, p: any) => {
          acc[p.user_id] = p.photo_url ?? null;
          return acc;
        }, {});
      }
    }

    setData(
      list.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        user_name: item.users?.full_name ?? 'User',
        user_email: item.users?.email ?? '',
        waktu: formatWaktu(item.created_at),
        scheduled_at: item.scheduled_at ? formatWaktu(item.scheduled_at) : null,
        keluhan: item.keluhan ?? null,
        photo_url: photoMap[item.user_id] ?? null,
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Realtime listener — auto refresh saat ada request baru dari user
  useEffect(() => {
    if (!ahliId) return;

    const channel = supabase
      .channel(`consultations-ahli-${ahliId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultations',
          filter: `ahli_id=eq.${ahliId}`,
        },
        () => {
          fetchData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ahliId, fetchData]);

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from('consultations').update({ status: 'confirmed' }).eq('id', id);
    if (error) {
      showErrorToast({ title: 'Gagal', message: 'Gagal menyetujui permintaan.' });
    } else {
      showSuccessToast({ title: 'Disetujui!', message: 'Permintaan konsultasi berhasil diterima.' });
      fetchData();
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from('consultations').update({ status: 'cancelled' }).eq('id', id);
    if (error) {
      showErrorToast({ title: 'Gagal', message: 'Gagal menolak permintaan.' });
    } else {
      showSuccessToast({ title: 'Ditolak', message: 'Permintaan konsultasi berhasil ditolak.' });
      fetchData();
    }
  };

  const handleLihatProfil = (item: Permintaan) => {
    setSelectedPermintaan(item);
    setShowModalProfil(true);
  };

  const EmptyState = () => (
    <tr>
      <td colSpan={4} className="text-center py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="#d1d5db" />
              <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">Belum ada permintaan konsultasi</p>
          <p className="text-gray-300 text-xs">Permintaan baru dari user akan muncul di sini</p>
        </div>
      </td>
    </tr>
  );

  const LoadingState = () => (
    <tr>
      <td colSpan={4} className="text-center py-12">
        <div className="flex justify-center items-center gap-2 text-gray-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Memuat data...</span>
        </div>
      </td>
    </tr>
  );

  const ActionButtons = ({ item }: { item: Permintaan }) => (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => handleLihatProfil(item)}
        title="Lihat Profil User"
        className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <User size={11} />
        <span className="hidden lg:inline">Profil</span>
      </button>
      <button onClick={() => handleApprove(item.id)} title="Setujui" className="w-[26px] h-[26px] rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-green-50 transition-colors">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button onClick={() => handleReject(item.id)} title="Tolak" className="w-[26px] h-[26px] rounded-full border-2 border-red-500 flex items-center justify-center hover:bg-red-50 transition-colors">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );

  return (
    <>
      <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
        <div className="p-4 sm:p-6 lg:p-10">
          <HeaderPermin />
          <div className="bg-white rounded-2xl shadow-md w-full overflow-hidden">
            <HeadT />
            <Hr />
            <div className="hidden md:block">
              <table className="w-full text-[13.5px] table-fixed">
                <thead>
                  <tr>
                    <th className={`text-left text-gray-500 font-semibold ${COL.user}`}>User</th>
                    <th className={`text-left text-gray-500 font-semibold ${COL.tujuan}`}>Email</th>
                    <th className={`hidden lg:table-cell text-left text-gray-500 font-semibold ${COL.waktu}`}>Waktu</th>
                    <th className={`text-center text-gray-500 font-semibold ${COL.aksi}`}>Aksi</th>
                  </tr>
                </thead>
              </table>
              <div className="max-h-[372px] overflow-y-auto">
                <table className="w-full text-[13.5px] table-fixed">
                  <tbody>
                    {loading ? (
                      <LoadingState />
                    ) : data.length === 0 ? (
                      <EmptyState />
                    ) : (
                      data.map((item) => (
                        <tr key={item.id} className="border-t border-gray-100 hover:bg-blue-50 transition-colors duration-150">
                          <td className={COL.user}>
                            <div className="flex items-center gap-3">
                              <UserAvatar photoUrl={item.photo_url} nama={item.user_name} />
                              <div className="min-w-0">
                                <span className="text-gray-800 font-medium truncate block">{item.user_name}</span>
                                {item.keluhan && (
                                  <span className="text-[10px] text-orange-500 font-medium flex items-center gap-0.5">
                                    <FileText size={9} /> Ada keluhan
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className={`${COL.tujuan} text-gray-500 text-xs truncate`}>{item.user_email}</td>
                          <td className={`hidden lg:table-cell ${COL.waktu} text-gray-500`}>{item.waktu}</td>
                          <td className={COL.aksi}>
                            <ActionButtons item={item} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="block md:hidden">
              {loading ? (
                <div className="flex justify-center items-center py-12 gap-2 text-gray-400">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm">Memuat data...</span>
                </div>
              ) : data.length === 0 ? (
                <div className="flex flex-col items-center py-12 gap-2 text-center px-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" fill="#d1d5db" />
                      <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm font-medium">Belum ada permintaan</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
                  {data.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 transition-colors">
                      <UserAvatar photoUrl={item.photo_url} nama={item.user_name} size="w-9 h-9" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800 truncate">{item.user_name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{item.user_email}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{item.waktu}</p>
                        {item.keluhan && (
                          <p className="text-[10px] text-orange-500 font-medium flex items-center gap-0.5 mt-0.5">
                            <FileText size={9} /> Ada keluhan
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <button onClick={() => handleLihatProfil(item)} className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 flex items-center gap-1 hover:bg-blue-100 transition-colors">
                          <User size={10} /> Profil
                        </button>
                        <div className="flex gap-1">
                          <button onClick={() => handleApprove(item.id)} className="w-7 h-7 rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-green-50 transition-colors">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                              <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button onClick={() => handleReject(item.id)} className="w-7 h-7 rounded-full border-2 border-red-500 flex items-center justify-center hover:bg-red-50 transition-colors">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                              <path d="M6 6l12 12M18 6L6 18" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalProfilUser
        isOpen={showModalProfil}
        onClose={() => {
          setShowModalProfil(false);
          setSelectedPermintaan(null);
        }}
        permintaan={selectedPermintaan}
      />
    </>
  );
}
