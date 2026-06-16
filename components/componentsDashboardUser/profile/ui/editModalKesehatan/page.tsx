'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { X, Save, Heart } from 'lucide-react';

interface EditModalKesehatanProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  initialData?: {
    height_cm?: number;
    weight_kg?: number;
    activity_level?: string;
    diet_type?: string;
    goal?: string;
  };
}

const ACTIVITY_OPTIONS = [
  { value: 'Sedentary', label: 'Sedentary', desc: 'Hampir tidak pernah olahraga' },
  { value: 'Ringan', label: 'Ringan', desc: 'Olahraga ringan 1–3x/minggu' },
  { value: 'Sedang', label: 'Sedang', desc: 'Olahraga sedang 3–5x/minggu' },
  { value: 'Aktif', label: 'Aktif', desc: 'Olahraga berat 6–7x/minggu' },
  { value: 'Sangat Aktif', label: 'Sangat Aktif', desc: 'Atlet / kerja fisik berat' },
];

const DIET_OPTIONS = [
  { value: 'Omnivore', label: 'Omnivore', icon: '🍖' },
  { value: 'Vegetarian', label: 'Vegetarian', icon: '🥗' },
  { value: 'Vegan', label: 'Vegan', icon: '🌱' },
  { value: 'Pescatarian', label: 'Pescatarian', icon: '🐟' },
  { value: 'Keto', label: 'Keto', icon: '🥑' },
  { value: 'Halal', label: 'Halal', icon: '☪️' },
];

const GOAL_OPTIONS = [
  { value: 'Menaikan berat badan', label: 'Menaikan berat badan', icon: '📈' },
  { value: 'Menurunkan berat badan', label: 'Menurunkan berat badan', icon: '📉' },
  { value: 'Menjaga berat badan', label: 'Menjaga berat badan', icon: '⚖️' },
  { value: 'Menambah massa otot', label: 'Menambah massa otot', icon: '💪' },
  { value: 'Meningkatkan stamina', label: 'Meningkatkan stamina', icon: '🏃' },
];

function hitungBMI(height_cm: number, weight_kg: number): number {
  if (!height_cm || !weight_kg) return 0;
  const heightM = height_cm / 100;
  return parseFloat((weight_kg / (heightM * heightM)).toFixed(1));
}

function kategoriBMI(bmi: number): { label: string; color: string } {
  if (bmi === 0) return { label: 'Belum diketahui', color: 'text-gray-400' };
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
  if (bmi < 25) return { label: 'Normal', color: 'text-green-500' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
  return { label: 'Obesitas', color: 'text-red-500' };
}

export default function EditModalKesehatan({ isOpen, onClose, onSuccess, userId, initialData }: EditModalKesehatanProps) {
  const [activityLevel, setActivityLevel] = useState(initialData?.activity_level ?? 'Sedang');
  const [dietType, setDietType] = useState(initialData?.diet_type ?? 'Omnivore');
  const [goal, setGoal] = useState(initialData?.goal ?? 'Menjaga berat badan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bmi = hitungBMI(initialData?.height_cm ?? 0, initialData?.weight_kg ?? 0);
  const { label: bmiLabel, color: bmiColor } = kategoriBMI(bmi);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    // ✅ Pakai upsert agar data dibuat jika belum ada
    const { error: upsertError } = await supabase.from('user_profiles').upsert(
      {
        user_id: userId,
        activity_level: activityLevel,
        diet_type: dietType,
        goal: goal,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

    setLoading(false);

    if (upsertError) {
      setError('Gagal menyimpan data. Silakan coba lagi.');
      console.error('Upsert error:', upsertError);
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 mt-15 md:mt-15">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Edit Kesehatan Personal</h2>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Perbarui informasi kesehatan personal anda</p>
            </div>
          </div>
          <button onClick={onClose} className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* BMI read only */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">BMI</label>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <span className="text-lg">🕐</span>
              <span className="text-sm font-semibold text-gray-700">{bmi}</span>
              <span className={`text-xs font-medium ml-auto ${bmiColor}`}>{bmiLabel}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Dihitung otomatis dari tinggi & berat badan</p>
          </div>

          {/* Aktivitas */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Aktivitas</label>
            <div className="relative">
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full appearance-none bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all cursor-pointer"
              >
                {ACTIVITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} — {opt.desc}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-green-500 text-xs">▾</div>
            </div>
          </div>

          {/* Diet */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Konsumsi Makanan</label>
            <div className="relative">
              <select
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
                className="w-full appearance-none bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all cursor-pointer"
              >
                {DIET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-red-400 text-xs">▾</div>
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tujuan Utama</label>
            <div className="relative">
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all cursor-pointer"
              >
                {GOAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▾</div>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 border border-red-100">⚠️ {error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button onClick={onClose} disabled={loading} className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50">
            CANCEL
          </button>
          <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            {loading ? 'MENYIMPAN...' : 'SAVE DATA'}
          </button>
        </div>
      </div>
    </div>
  );
}
