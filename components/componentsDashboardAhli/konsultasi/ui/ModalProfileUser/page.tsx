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
  target_fitness: string | null;
  target_weight_kg: number | null;
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
  onAccept?: () => void;
}

function getBmiStatus(bmi: number | null): { label: string; color: string; bg: string } {
  if (!bmi) return { label: 'Tidak diketahui', color: 'text-gray-500', bg: 'bg-gray-100' };
  if (bmi < 18.5) return { label: 'Kurus', color: 'text-blue-600', bg: 'bg-blue-50' };
  if (bmi < 25) return { label: 'Normal', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  if (bmi < 30) return { label: 'Kelebihan Berat', color: 'text-amber-600', bg: 'bg-amber-50' };
  return { label: 'Obesitas', color: 'text-red-600', bg: 'bg-red-50' };
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

      const { data: targetData } = await supabase.from('user_profiles').select('target_fitness, target_weight_kg, diet_type').eq('user_id', userId).maybeSingle();

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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Profil User</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Konten scrollable */}
        <div className="overflow-y-auto max-h-[75vh]">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Avatar + nama */}
              <div className="flex items-center gap-3.5 px-5 pt-5 pb-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-emerald-200">
                  {showPhoto ? <img src={photoUrl!} alt={displayName} className="w-full h-full object-cover" onError={() => setImgError(true)} /> : <span className="text-white font-bold text-lg">{initials}</span>}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-base leading-tight">{displayName}</p>
                  {userEmail && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{userEmail}</p>}
                  <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                </div>
              </div>

              {/* DATA FISIK */}
              <div className="px-5 pb-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Data Fisik</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { value: profile?.height_cm, label: 'TINGGI (CM)' },
                    { value: profile?.weight_kg, label: 'BERAT (KG)' },
                    { value: profile?.age, label: 'USIA (THN)' },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl py-3 text-center border border-gray-100">
                      <p className="text-2xl font-bold text-gray-900">{item.value ?? '-'}</p>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium tracking-wide">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* IMT */}
                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm text-gray-600">IMT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{computedBmi ? `${computedBmi} kg/m²` : '-'}</span>
                    {computedBmi && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${computedStatus.bg} ${computedStatus.color}`}>{computedStatus.label}</span>}
                  </div>
                </div>
              </div>

              {/* TARGET KESEHATAN */}
              {target && (target.target_fitness || target.target_weight_kg || target.diet_type) && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-4 mb-2">Target Kesehatan</p>
                  <div className="divide-y divide-gray-100">
                    {target.target_fitness && (
                      <div className="flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Dumbbell className="w-4 h-4" />
                          <span className="text-sm text-gray-600">Kebugaran</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{target.target_fitness}</span>
                      </div>
                    )}
                    {target.target_weight_kg && (
                      <div className="flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Target className="w-4 h-4" />
                          <span className="text-sm text-gray-600">Target berat</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{target.target_weight_kg} kg</span>
                      </div>
                    )}
                    {target.diet_type && (
                      <div className="flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Utensils className="w-4 h-4" />
                          <span className="text-sm text-gray-600">Pola makan</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{target.diet_type}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer tombol */}
        {onAccept && (
          <div className="px-5 py-4 border-t border-gray-100">
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
