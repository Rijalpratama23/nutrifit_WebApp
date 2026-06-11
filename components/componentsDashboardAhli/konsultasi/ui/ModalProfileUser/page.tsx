'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { X, Ruler, Weight, CalendarDays, Activity, Target, Utensils, Dumbbell } from 'lucide-react';

interface UserProfile {
  height_cm: number | null;
  weight_kg: number | null;
  age: number | null;
  full_name: string | null;
}

interface UserTarget {
  fitness_goal: string | null;
  target_weight: number | null;
  diet_type: string | null;
}

interface UserHealthInfo {
  bmi: number | null;
  activity_level: string | null;
  primary_goal: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

function getBmiStatus(bmi: number | null): { label: string; color: string; bg: string } {
  if (!bmi) return { label: 'Tidak diketahui', color: 'text-gray-500', bg: 'bg-gray-100' };
  if (bmi < 18.5) return { label: 'Kurus', color: 'text-blue-700', bg: 'bg-blue-50' };
  if (bmi < 25) return { label: 'Normal', color: 'text-green-700', bg: 'bg-green-50' };
  if (bmi < 30) return { label: 'Kelebihan Berat', color: 'text-amber-700', bg: 'bg-amber-50' };
  return { label: 'Obesitas', color: 'text-red-700', bg: 'bg-red-50' };
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-gray-800">{value}</div>
    </div>
  );
}

export default function ModalProfilUser({ isOpen, onClose, userId }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [target, setTarget] = useState<UserTarget | null>(null);
  const [health, setHealth] = useState<UserHealthInfo | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchData = async () => {
      setLoading(true);

      // Data user (nama)
      const { data: userData } = await supabase.from('users').select('full_name').eq('id', userId).single();

      if (userData) setUserName(userData.full_name ?? '');

      // Profil fisik user
      const { data: profileData } = await supabase.from('user_profiles').select('height_cm, weight_kg, age, full_name').eq('user_id', userId).maybeSingle();

      if (profileData) setProfile(profileData);

      // Target kesehatan — dari tabel profiles (sesuai schema)
      const { data: targetData } = await supabase.from('profiles').select('fitness_goal, target_weight, diet_type').eq('user_id', userId).maybeSingle();

      if (targetData) setTarget(targetData);

      // Kesehatan personal — BMI, aktivitas, tujuan
      const { data: healthData } = await supabase.from('user_profiles').select('bmi, activity_level, primary_goal').eq('user_id', userId).maybeSingle();

      if (healthData) setHealth(healthData);

      setLoading(false);
    };

    fetchData();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const displayName = profile?.full_name || userName || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const bmiStatus = getBmiStatus(health?.bmi ?? null);

  // Hitung IMT dari height & weight jika kolom bmi tidak ada
  const computedBmi = health?.bmi ?? (profile?.height_cm && profile?.weight_kg ? parseFloat((profile.weight_kg / Math.pow(profile.height_cm / 100, 2)).toFixed(1)) : null);
  const computedStatus = getBmiStatus(computedBmi);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-800">Profil User</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" aria-label="Tutup modal">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Konten */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Avatar + nama */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 border-2 border-emerald-100">
                  <span className="text-emerald-600 font-semibold text-lg">{initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-base">{displayName}</p>
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Online
                  </span>
                </div>
              </div>

              {/* Stat cards: tinggi, berat, usia */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    {profile?.height_cm ?? '-'}
                    <span className="text-xs font-normal text-gray-500 ml-0.5">cm</span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wide">Tinggi</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    {profile?.weight_kg ?? '-'}
                    <span className="text-xs font-normal text-gray-500 ml-0.5">kg</span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wide">Berat</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    {profile?.age ?? '-'}
                    <span className="text-xs font-normal text-gray-500 ml-0.5">thn</span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wide">Usia</p>
                </div>
              </div>

              {/* Data fisik */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Data Fisik</h3>
                <div className="bg-gray-50 rounded-xl px-3">
                  <InfoRow
                    icon={<Activity className="w-4 h-4" />}
                    label="IMT"
                    value={
                      <div className="flex items-center gap-2">
                        <span>{computedBmi ?? '-'} kg/m²</span>
                        {computedBmi && <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${computedStatus.bg} ${computedStatus.color}`}>{computedStatus.label}</span>}
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Target kesehatan */}
              {target && (
                <div className="mb-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Kesehatan</h3>
                  <div className="bg-gray-50 rounded-xl px-3">
                    {target.fitness_goal && <InfoRow icon={<Dumbbell className="w-4 h-4" />} label="Kebugaran" value={target.fitness_goal} />}
                    {target.target_weight && <InfoRow icon={<Target className="w-4 h-4" />} label="Target berat" value={`${target.target_weight} kg`} />}
                    {target.diet_type && <InfoRow icon={<Utensils className="w-4 h-4" />} label="Pola makan" value={target.diet_type} />}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
