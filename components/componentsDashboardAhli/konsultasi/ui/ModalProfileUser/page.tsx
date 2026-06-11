'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { X, Activity, Target, Utensils, Dumbbell, CheckCircle2 } from 'lucide-react';

interface UserProfile {
  height_cm: number | null;
  weight_kg: number | null;
  age: number | null;
  full_name: string | null;
  photo_url: string | null;
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
  onAccept?: () => void; // opsional: tombol "Terima & Mulai Sesi"
}

function getBmiStatus(bmi: number | null): { label: string; color: string; bg: string } {
  if (!bmi) return { label: 'Tidak diketahui', color: 'text-gray-500', bg: 'bg-gray-100' };
  if (bmi < 18.5) return { label: 'Kurus', color: 'text-blue-600', bg: 'bg-blue-50' };
  if (bmi < 25) return { label: 'Normal', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  if (bmi < 30) return { label: 'Kelebihan Berat', color: 'text-amber-600', bg: 'bg-amber-50' };
  return { label: 'Obesitas', color: 'text-red-600', bg: 'bg-red-50' };
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2.5 text-gray-400 text-sm">
        {icon}
        <span className="text-gray-600">{label}</span>
      </div>
      <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}

export default function ModalProfilUser({ isOpen, onClose, userId, onAccept }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [target, setTarget] = useState<UserTarget | null>(null);
  const [health, setHealth] = useState<UserHealthInfo | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !userId) return;
    setImgError(false);

    const fetchData = async () => {
      setLoading(true);

      const { data: userData } = await supabase.from('users').select('full_name, email').eq('id', userId).single();

      if (userData) {
        setUserName(userData.full_name ?? '');
        setUserEmail(userData.email ?? '');
      }

      const { data: profileData } = await supabase.from('user_profiles').select('height_cm, weight_kg, age, full_name, photo_url').eq('user_id', userId).maybeSingle();

      if (profileData) setProfile(profileData);

      const { data: targetData } = await supabase.from('profiles').select('fitness_goal, target_weight, diet_type').eq('user_id', userId).maybeSingle();

      if (targetData) setTarget(targetData);

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

  const computedBmi = health?.bmi ?? (profile?.height_cm && profile?.weight_kg ? parseFloat((profile.weight_kg / Math.pow(profile.height_cm / 100, 2)).toFixed(1)) : null);
  const computedStatus = getBmiStatus(computedBmi);

  const photoUrl = profile?.photo_url ?? null;
  const showPhoto = !!photoUrl && !imgError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-700 tracking-wide">Profil User</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" aria-label="Tutup modal">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Konten */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Avatar + nama */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-emerald-200">
                  {showPhoto ? <img src={photoUrl!} alt={displayName} className="w-full h-full object-cover" onError={() => setImgError(true)} /> : <span className="text-emerald-600 font-bold text-base">{initials}</span>}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-base leading-tight">{displayName}</p>
                  {userEmail && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">{userEmail}</p>}
                  <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                </div>
              </div>

              {/* Stat cards: tinggi, berat, usia */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { value: profile?.height_cm, unit: 'cm', label: 'Tinggi (CM)' },
                  { value: profile?.weight_kg, unit: 'kg', label: 'Berat (KG)' },
                  { value: profile?.age, unit: 'thn', label: 'Usia (THN)' },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                    <p className="text-xl font-bold text-gray-900">{item.value ?? '-'}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest font-medium">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Data fisik */}
              <div className="mb-4">
                <div className="divide-y divide-gray-100">
                  <InfoRow
                    icon={<Activity className="w-4 h-4" />}
                    label="IMT"
                    value={
                      <div className="flex items-center gap-2">
                        <span>{computedBmi ?? '-'} kg/m²</span>
                        {computedBmi && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${computedStatus.bg} ${computedStatus.color}`}>{computedStatus.label}</span>}
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Target kesehatan */}
              {target && (target.fitness_goal || target.target_weight || target.diet_type) && (
                <div className="mb-2">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Target Kesehatan</p>
                  <div className="bg-gray-50 rounded-xl px-3 border border-gray-100">
                    {target.fitness_goal && <InfoRow icon={<Dumbbell className="w-4 h-4" />} label="Kebugaran" value={target.fitness_goal} />}
                    {target.target_weight && <InfoRow icon={<Target className="w-4 h-4" />} label="Target berat" value={`${target.target_weight} kg`} />}
                    {target.diet_type && <InfoRow icon={<Utensils className="w-4 h-4" />} label="Pola makan" value={target.diet_type} />}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer tombol */}
        {onAccept && (
          <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
            <button onClick={onAccept} className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors">
              <CheckCircle2 className="w-4 h-4" />
              Terima &amp; Mulai Sesi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
