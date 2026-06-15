'use client';

import { useState, useEffect } from 'react';
import { X, User, Ruler, Weight, Calendar, Activity, Target, Leaf, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfileSummary {
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

interface AhliInfo {
  id: string;
  full_name: string;
  specialization: string;
  profile_photo_url: string | null;
}

interface ModalKonfirmasiKonsultasiProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (keluhan: string) => Promise<void>;
  ahli: AhliInfo;
  loading?: boolean;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function hitungBMI(height_cm?: number | null, weight_kg?: number | null): string {
  if (!height_cm || !weight_kg) return '-';
  const h = height_cm / 100;
  return (weight_kg / (h * h)).toFixed(1);
}

function kategoriBMI(bmi: string): { label: string; color: string } {
  const val = parseFloat(bmi);
  if (isNaN(val)) return { label: '-', color: 'text-gray-400' };
  if (val < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
  if (val < 25) return { label: 'Normal', color: 'text-green-600' };
  if (val < 30) return { label: 'Overweight', color: 'text-yellow-500' };
  return { label: 'Obesitas', color: 'text-red-500' };
}

// ─── Row Info kecil ───────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-700 truncate">{value || '-'}</p>
      </div>
    </div>
  );
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────

export default function ModalKonfirmasiKonsultasi({ isOpen, onClose, onConfirm, ahli, loading = false }: ModalKonfirmasiKonsultasiProps) {
  const [profile, setProfile] = useState<UserProfileSummary | null>(null);
  const [keluhan, setKeluhan] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setKeluhan('');
    fetchProfile();
  }, [isOpen]);

  const fetchProfile = async () => {
    setFetchLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      setFetchLoading(false);
      return;
    }

    const [{ data: userData }, { data: profileData }] = await Promise.all([
      supabase.from('users').select('full_name').eq('id', session.user.id).single(),
      supabase.from('user_profiles').select('age, gender, height_cm, weight_kg, activity_level, goal, target_fitness, target_weight_kg, diet_type').eq('user_id', session.user.id).single(),
    ]);

    setProfile({
      full_name: userData?.full_name ?? 'User',
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
    setFetchLoading(false);
  };

  const handleConfirm = async () => {
    await onConfirm(keluhan.trim());
  };

  if (!isOpen) return null;

  const bmi = hitungBMI(profile?.height_cm, profile?.weight_kg);
  const { label: bmiLabel, color: bmiColor } = kategoriBMI(bmi);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-800">Konfirmasi Konsultasi</h2>
            <p className="text-xs text-gray-400 mt-0.5">Pastikan data profil kamu sudah benar</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {/* Info Ahli yang dipilih */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
            {ahli.profile_photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ahli.profile_photo_url} alt={ahli.full_name} className="w-10 h-10 rounded-full object-cover border-2 border-white flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-blue-500" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide">Ahli yang dipilih</p>
              <p className="text-sm font-bold text-gray-800 truncate">{ahli.full_name}</p>
              <p className="text-xs text-blue-600">{ahli.specialization}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 ml-auto" />
          </div>

          {/* Ringkasan Profil User */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-blue-500 rounded-full" />
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Ringkasan Profil Kamu</h3>
            </div>

            {fetchLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4">
                {/* Nama & Gender */}
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

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Tinggi</p>
                    <p className="text-base font-bold text-gray-800">{profile?.height_cm ?? '-'}</p>
                    <p className="text-[9px] text-gray-400">cm</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Berat</p>
                    <p className="text-base font-bold text-gray-800">{profile?.weight_kg ?? '-'}</p>
                    <p className="text-[9px] text-gray-400">kg</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">BMI</p>
                    <p className={`text-base font-bold ${bmiColor}`}>{bmi}</p>
                    <p className={`text-[9px] ${bmiColor}`}>{bmiLabel}</p>
                  </div>
                </div>

                {/* Detail Info */}
                <div className="space-y-0">
                  <InfoRow icon={<Activity size={14} />} label="Level Aktivitas" value={profile?.activity_level ?? '-'} />
                  <InfoRow icon={<Target size={14} />} label="Tujuan Utama" value={profile?.goal ?? '-'} />
                  <InfoRow icon={<Ruler size={14} />} label="Target Kebugaran" value={profile?.target_fitness ?? '-'} />
                  <InfoRow icon={<Weight size={14} />} label="Target Berat Badan" value={profile?.target_weight_kg ? `${profile.target_weight_kg} kg` : '-'} />
                  <InfoRow icon={<Leaf size={14} />} label="Pola Makan" value={profile?.diet_type ?? '-'} />
                </div>

                {/* Warning jika profil belum lengkap */}
                {(!profile?.height_cm || !profile?.weight_kg || !profile?.goal) && (
                  <div className="mt-3 flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-yellow-700">Profil belum lengkap</p>
                      <p className="text-[10px] text-yellow-600 mt-0.5">
                        Lengkapi profil kamu di halaman{' '}
                        <a href="/user/profile" className="underline font-semibold">
                          Profile
                        </a>{' '}
                        agar ahli bisa memberi rekomendasi yang lebih tepat.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Textarea Keluhan */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-orange-400 rounded-full" />
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Keluhan Utama</h3>
              <span className="text-[10px] text-gray-400 font-normal">(opsional)</span>
            </div>
            <textarea
              value={keluhan}
              onChange={(e) => setKeluhan(e.target.value)}
              placeholder="Ceritakan keluhan atau tujuan konsultasi kamu... Contoh: Saya ingin menurunkan berat badan 5kg dalam 2 bulan, atau saya memiliki masalah kolesterol tinggi."
              maxLength={500}
              rows={4}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all resize-none"
            />
            <p className="text-right text-[10px] text-gray-400 mt-0.5">{keluhan.length}/500</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} disabled={loading} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || fetchLoading}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Mengirim...' : 'Ajukan Konsultasi'}
          </button>
        </div>
      </div>
    </div>
  );
}
