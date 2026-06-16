'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';
import { X, ChevronRight, ChevronLeft, User, Activity, Target, CheckCircle } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: () => void;
}

interface FormData {
  full_name: string;
  date_of_birth: string;
  gender: string;
  weight: string;
  height: string;
  activity_level: string;
  health_goal: string;
  custom_health_goal: string;
  target_weight: string;
  dietary_preference: string;
  custom_dietary_preference: string;
}

const INITIAL_FORM: FormData = {
  full_name: '',
  date_of_birth: '',
  gender: '',
  weight: '',
  height: '',
  activity_level: '',
  health_goal: '',
  custom_health_goal: '',
  target_weight: '',
  dietary_preference: '',
  custom_dietary_preference: '',
};

const STEPS = [
  { id: 1, label: 'Data Pribadi', icon: User },
  { id: 2, label: 'Kesehatan', icon: Activity },
  { id: 3, label: 'Tujuan', icon: Target },
  { id: 4, label: 'Selesai', icon: CheckCircle },
];

const ACTIVITY_LEVEL_LABELS: Record<string, string> = {
  sedentary: 'Tidak Aktif',
  light: 'Ringan',
  moderate: 'Sedang',
  active: 'Aktif',
  very_active: 'Sangat Aktif',
};

const DIET_TYPE_LABELS: Record<string, string> = {
  none: 'Tidak ada preferensi khusus',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  halal: 'Halal',
  low_carb: 'Rendah Karbohidrat',
  high_protein: 'Tinggi Protein',
};

const HEALTH_GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Menurunkan berat badan',
  gain_muscle: 'Menambah massa otot',
  maintain_weight: 'Menjaga berat badan',
  improve_health: 'Memperbaiki kesehatan umum',
  manage_condition: 'Mengelola kondisi medis',
};

function calculateAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const router = useRouter();

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (step === 1) {
      if (!formData.full_name.trim()) newErrors.full_name = 'Nama lengkap wajib diisi';
      if (!formData.date_of_birth) newErrors.date_of_birth = 'Tanggal lahir wajib diisi';
      if (!formData.gender) newErrors.gender = 'Jenis kelamin wajib dipilih';
    }

    if (step === 2) {
      if (!formData.weight) newErrors.weight = 'Berat badan wajib diisi';
      if (!formData.height) newErrors.height = 'Tinggi badan wajib diisi';
      if (!formData.activity_level) newErrors.activity_level = 'Tingkat aktivitas wajib dipilih';
    }

    if (step === 3) {
      if (!formData.health_goal) {
        newErrors.health_goal = 'Tujuan kesehatan wajib dipilih';
      } else if (formData.health_goal === 'other' && !formData.custom_health_goal.trim()) {
        newErrors.health_goal = 'Mohon tuliskan tujuan kesehatan Anda';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User tidak ditemukan');

      const age = calculateAge(formData.date_of_birth);

      const goalLabel = formData.health_goal === 'other' ? formData.custom_health_goal : (HEALTH_GOAL_LABELS[formData.health_goal] ?? formData.health_goal);

      const dietLabel = formData.dietary_preference === 'other' ? formData.custom_dietary_preference : (DIET_TYPE_LABELS[formData.dietary_preference] ?? formData.dietary_preference);

      const activityLabel = ACTIVITY_LEVEL_LABELS[formData.activity_level] ?? formData.activity_level;
      const now = new Date().toISOString();

      // 1. Update nama di tabel users
      const { error: usersError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          updated_at: now,
        })
        .eq('id', user.id);

      if (usersError) throw usersError;

      // 2. Upsert data kesehatan & target ke user_profiles
      const { error: profileError } = await supabase.from('user_profiles').upsert(
        {
          user_id: user.id,
          height_cm: Math.round(parseFloat(formData.height)) || null,
          weight_kg: Math.round(parseFloat(formData.weight)) || null,
          date_of_birth: formData.date_of_birth || null,
          gender: formData.gender || null,
          age,
          activity_level: activityLabel,
          target_weight_kg: formData.target_weight ? Math.round(parseFloat(formData.target_weight)) : null,
          diet_type: dietLabel,
          goal: goalLabel,
          target_fitness: goalLabel,
          updated_at: now,
        },
        { onConflict: 'user_id' },
      );

      if (profileError) throw profileError;

      // 3. Tandai onboarding selesai
      const { error: completeError } = await supabase.from('profiles').update({ is_profile_complete: true }).eq('id', user.id);

      if (completeError) throw completeError;

      setCurrentStep(4);
      showSuccessToast({
        title: 'Profil berhasil disimpan',
        message: 'Data Anda sudah tersimpan dan akan tampil di halaman Profile.',
      });
    } catch (err) {
      console.error('Error menyimpan profil:', err);
      showErrorToast({
        title: 'Gagal menyimpan data',
        message: 'Terjadi kesalahan, silakan coba lagi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onComplete();
    router.push('/user/profile');
  };

  const handleSkip = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ is_profile_complete: false }).eq('id', user.id);
    }
    onComplete();
  };

  const InputClass =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400';
  const ErrorClass = 'text-red-500 text-xs mt-1';
  const LabelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 pt-6 pb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">{currentStep < 4 ? 'Lengkapi Profil Anda 👋' : 'Profil Lengkap! 🎉'}</h2>
              <p className="text-green-100 text-sm mt-1">{currentStep < 4 ? 'Bantu kami memberikan rekomendasi terbaik untuk Anda' : 'Data Anda telah berhasil disimpan'}</p>
            </div>
            {currentStep < 4 && (
              <button onClick={handleSkip} className="text-green-200 hover:text-white transition-colors p-1" title="Lewati untuk sekarang">
                <X size={20} />
              </button>
            )}
          </div>

          {currentStep < 4 && (
            <div className="flex items-center gap-2">
              {STEPS.slice(0, 3).map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isDone = currentStep > step.id;
                return (
                  <div key={step.id} className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isActive ? 'bg-white text-green-600 shadow-sm' : isDone ? 'bg-green-400/40 text-white' : 'bg-green-400/20 text-green-200'
                      }`}
                    >
                      <Icon size={12} />
                      <span>{step.label}</span>
                    </div>
                    {idx < 2 && <div className={`h-px w-4 ${isDone ? 'bg-green-300' : 'bg-green-400/30'}`} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="-mt-4 bg-white dark:bg-gray-900 rounded-t-2xl px-6 pt-6 pb-6 space-y-4 max-h-[55vh] overflow-y-auto">
          {/* ===== STEP 1: Data Pribadi ===== */}
          {currentStep === 1 && (
            <>
              <div>
                <label className={LabelClass}>Nama Lengkap *</label>
                <input type="text" className={InputClass} placeholder="Masukkan nama lengkap Anda" value={formData.full_name} onChange={(e) => updateField('full_name', e.target.value)} />
                {errors.full_name && <p className={ErrorClass}>{errors.full_name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LabelClass}>Tanggal Lahir *</label>
                  <input type="date" className={InputClass} value={formData.date_of_birth} onChange={(e) => updateField('date_of_birth', e.target.value)} />
                  {errors.date_of_birth && <p className={ErrorClass}>{errors.date_of_birth}</p>}
                </div>
                <div>
                  <label className={LabelClass}>Jenis Kelamin *</label>
                  <select className={InputClass} value={formData.gender} onChange={(e) => updateField('gender', e.target.value)}>
                    <option value="">Pilih</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                  {errors.gender && <p className={ErrorClass}>{errors.gender}</p>}
                </div>
              </div>
            </>
          )}

          {/* ===== STEP 2: Data Kesehatan ===== */}
          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LabelClass}>Berat Badan (kg) *</label>
                  <input type="number" className={InputClass} placeholder="e.g. 65" min="20" max="300" value={formData.weight} onChange={(e) => updateField('weight', e.target.value)} />
                  {errors.weight && <p className={ErrorClass}>{errors.weight}</p>}
                </div>
                <div>
                  <label className={LabelClass}>Tinggi Badan (cm) *</label>
                  <input type="number" className={InputClass} placeholder="e.g. 165" min="100" max="250" value={formData.height} onChange={(e) => updateField('height', e.target.value)} />
                  {errors.height && <p className={ErrorClass}>{errors.height}</p>}
                </div>
              </div>

              <div>
                <label className={LabelClass}>Tingkat Aktivitas *</label>
                <select className={InputClass} value={formData.activity_level} onChange={(e) => updateField('activity_level', e.target.value)}>
                  <option value="">Pilih tingkat aktivitas</option>
                  <option value="sedentary">Tidak aktif (kerja kantoran, jarang olahraga)</option>
                  <option value="light">Aktif ringan (olahraga 1–3x/minggu)</option>
                  <option value="moderate">Aktif sedang (olahraga 3–5x/minggu)</option>
                  <option value="active">Aktif (olahraga 6–7x/minggu)</option>
                  <option value="very_active">Sangat aktif (atlet / kerja fisik berat)</option>
                </select>
                {errors.activity_level && <p className={ErrorClass}>{errors.activity_level}</p>}
              </div>
            </>
          )}

          {/* ===== STEP 3: Tujuan ===== */}
          {currentStep === 3 && (
            <>
              <div>
                <label className={LabelClass}>Tujuan Kesehatan Utama *</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: 'lose_weight', label: '🏃 Turunkan Berat Badan' },
                    { value: 'gain_muscle', label: '💪 Tingkatkan Massa Otot' },
                    { value: 'maintain_weight', label: '⚖️ Jaga Berat Badan Ideal' },
                    { value: 'improve_health', label: '❤️ Perbaiki Kesehatan Umum' },
                    { value: 'manage_condition', label: '🩺 Kelola Kondisi Medis' },
                    { value: 'other', label: '✏️ Lainnya' },
                  ].map((goal) => (
                    <label
                      key={goal.value}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                        formData.health_goal === goal.value ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="health_goal"
                        value={goal.value}
                        checked={formData.health_goal === goal.value}
                        onChange={(e) => {
                          updateField('health_goal', e.target.value);
                          updateField('custom_health_goal', '');
                        }}
                        className="accent-green-500"
                      />
                      <span className="text-sm text-gray-800 dark:text-gray-200">{goal.label}</span>
                    </label>
                  ))}
                </div>

                {formData.health_goal === 'other' && (
                  <input type="text" className={`${InputClass} mt-2`} placeholder="Tuliskan tujuan kesehatan Anda..." value={formData.custom_health_goal} onChange={(e) => updateField('custom_health_goal', e.target.value)} />
                )}

                {errors.health_goal && <p className={ErrorClass}>{errors.health_goal}</p>}
              </div>

              <div>
                <label className={LabelClass}>Target Berat Badan (kg)</label>
                <input type="number" className={InputClass} placeholder="e.g. 55 (opsional)" min="20" max="300" value={formData.target_weight} onChange={(e) => updateField('target_weight', e.target.value)} />
              </div>

              <div>
                <label className={LabelClass}>Preferensi Diet</label>
                <select
                  className={InputClass}
                  value={formData.dietary_preference}
                  onChange={(e) => {
                    updateField('dietary_preference', e.target.value);
                    updateField('custom_dietary_preference', '');
                  }}
                >
                  <option value="">Pilih preferensi diet</option>
                  <option value="none">Tidak ada preferensi khusus</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="halal">Halal</option>
                  <option value="low_carb">Rendah Karbohidrat</option>
                  <option value="high_protein">Tinggi Protein</option>
                  <option value="other">Lainnya</option>
                </select>

                {formData.dietary_preference === 'other' && (
                  <input type="text" className={`${InputClass} mt-2`} placeholder="Tuliskan preferensi diet Anda..." value={formData.custom_dietary_preference} onChange={(e) => updateField('custom_dietary_preference', e.target.value)} />
                )}
              </div>
            </>
          )}

          {/* ===== STEP 4: Selesai ===== */}
          {currentStep === 4 && (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-500" size={44} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Selamat, {formData.full_name}!</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">Profil Anda telah tersimpan. Kini kami bisa memberikan rekomendasi nutrisi dan konsultasi yang lebih personal untuk Anda.</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 w-full text-left">
                <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-2">Langkah selanjutnya:</p>
                <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Jelajahi artikel edukasi nutrisi
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Buat jadwal konsultasi dengan ahli gizi
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Pantau progress kesehatan Anda
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800">
          {currentStep < 4 ? (
            <>
              <div className="text-xs text-gray-400">Langkah {currentStep} dari 3</div>
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Kembali
                  </button>
                )}
                {currentStep < 3 ? (
                  <button onClick={handleNext} className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-blue-400 cursor-pointer text-white text-sm font-medium transition-colors">
                    Lanjut
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-blue-300 cursor-pointer disabled:opacity-60 text-white text-sm font-medium transition-colors"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Profil'}
                    {!isSubmitting && <CheckCircle size={16} />}
                  </button>
                )}
              </div>
            </>
          ) : (
            <button onClick={handleFinish} className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors">
              Mulai Perjalanan Sehat Saya →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
