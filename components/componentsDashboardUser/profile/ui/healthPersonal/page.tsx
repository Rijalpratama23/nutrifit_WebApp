'use client';

import { useState, useEffect } from 'react';
import { Heart, PencilLine, Timer, Activity, Target } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import EditModalKesehatan from '../editModalKesehatan/page';

interface HealthData {
  height_cm?: number;
  weight_kg?: number;
  activity_level?: string;
  diet_type?: string;
  goal?: string;
}

interface PersonalHealthProps {
  userId: string;
  initialData: HealthData;
}

function hitungBMI(height_cm?: number, weight_kg?: number): number {
  if (!height_cm || !weight_kg) return 0;
  const h = height_cm / 100;
  return parseFloat((weight_kg / (h * h)).toFixed(1));
}

function kategoriBMI(bmi: number): { label: string; color: string } {
  if (bmi === 0) return { label: 'Belum diketahui', color: 'text-gray-400' };
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
  if (bmi < 25) return { label: 'Normal', color: 'text-green-600' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
  return { label: 'Obesitas', color: 'text-red-500' };
}

export default function PersonalHealth({ userId, initialData }: PersonalHealthProps) {
  const [data, setData] = useState<HealthData>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  const bmi = hitungBMI(data.height_cm, data.weight_kg);
  const { label: bmiLabel, color: bmiColor } = kategoriBMI(bmi);

  const handleSuccess = async () => {
    const { data: updated } = await supabase.from('user_profiles').select('height_cm, weight_kg, activity_level, diet_type, goal').eq('user_id', userId).single();
    if (updated) setData(updated);
  };

  return (
    <>
      <div className="mt-4 sm:mt-6 md:mt-3 w-full p-3 sm:p-4 md:p-2 lg:p-1">
        <div className="rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-200 shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-green-500 flex-shrink-0">
                <Heart size={24} strokeWidth={2.5} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>
              <h2 className="font-bold text-gray-800 text-base sm:text-lg md:text-xl tracking-wide truncate">KESEHATAN PERSONAL</h2>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="text-gray-800 hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg sm:rounded-full transition-colors flex-shrink-0">
              <PencilLine size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-start lg:items-center">
            {/* BMI */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-blue-100 rounded-lg sm:rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                <Timer size={28} className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-bold text-purple-400 uppercase tracking-widest leading-none mb-1">BMI</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900">{bmi || '—'}</span>
                  <span className={`text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full uppercase tracking-wider ${bmiColor}`}>{bmiLabel}</span>
                </div>
              </div>
            </div>

            {/* Aktivitas */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-green-100 transition-colors">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-green-100 rounded-lg sm:rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0">
                <Activity size={28} className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-bold text-purple-400 uppercase tracking-widest leading-none mb-1">Aktivitas</p>
                <p className="text-gray-900 font-bold text-base sm:text-lg truncate">{data.activity_level || '—'}</p>
              </div>
            </div>

            {/* Tujuan Utama */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-red-100 transition-colors sm:col-span-2 lg:col-span-1">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-red-100 rounded-lg sm:rounded-2xl flex items-center justify-center text-red-400 flex-shrink-0">
                <Target size={28} className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-bold text-purple-400 uppercase tracking-widest leading-none mb-1">Tujuan Utama</p>
                <p className="text-gray-900 font-bold text-base sm:text-lg truncate">{data.goal || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditModalKesehatan
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        userId={userId}
        initialData={{
          height_cm: data.height_cm,
          weight_kg: data.weight_kg,
          activity_level: data.activity_level,
          diet_type: data.diet_type,
          goal: data.goal,
        }}
      />
    </>
  );
}
