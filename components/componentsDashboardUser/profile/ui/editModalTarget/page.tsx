'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2, Target } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';

interface EditTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const TARGET_KEBUGARAN_OPTIONS = ['Menambah masa otot', 'Menurunkan berat badan', 'Menjaga berat badan', 'Meningkatkan stamina', 'Hidup sehat', 'Meningkatkan fleksibilitas'];

const KONSUMSI_MAKAN_OPTIONS = ['Vegetarian', 'Vegan', 'Semua makanan', 'Pescatarian', 'Keto', 'Diet rendah kalori', 'Diet tinggi protein'];

export default function EditTargetModal({ isOpen, onClose, onSaved }: EditTargetModalProps) {
  const [form, setForm] = useState({
    target_fitness: 'Menambah masa otot',
    target_weight_kg: '',
    diet_type: 'Vegetarian',
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      setUserId(session.user.id);

      const { data } = await supabase.from('user_profiles').select('target_fitness, target_weight_kg, diet_type').eq('user_id', session.user.id).single();

      if (data) {
        setForm({
          target_fitness: data.target_fitness ?? 'Menambah masa otot',
          target_weight_kg: data.target_weight_kg ? String(data.target_weight_kg) : '',
          diet_type: data.diet_type ?? 'Vegetarian',
        });
      }
    };
    fetchData();
  }, [isOpen]);

  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('user_profiles').upsert(
        {
          user_id: userId,
          target_fitness: form.target_fitness,
          target_weight_kg: form.target_weight_kg ? parseInt(form.target_weight_kg) : null,
          diet_type: form.diet_type,
        },
        { onConflict: 'user_id' },
      );

      if (error) throw new Error(error.message);

      showSuccessToast({ title: 'Target Diperbarui!', message: 'Target kesehatan berhasil disimpan.' });
      onSaved();
      onClose();
    } catch (err: any) {
      showErrorToast({ title: 'Gagal Menyimpan', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center">
              <Target size={14} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-800 tracking-widest uppercase">Edit Target</h2>
              <p className="text-[10px] text-gray-400">Perbarui target untuk membantu mencapai tujuan kesehatan yang lebih baik</p>
            </div>
          </div>
          <button onClick={!loading ? onClose : undefined} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-4">
          {/* Target Kebugaran */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-1.5">Target Kebugaran</label>
            <div className="relative">
              <select
                value={form.target_fitness}
                onChange={(e) => setForm({ ...form, target_fitness: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all bg-white appearance-none cursor-pointer"
              >
                {TARGET_KEBUGARAN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Target Berat Badan */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-1.5">Target Berat Badan (KG)</label>
            <div className="relative">
              <input
                type="number"
                value={form.target_weight_kg}
                onChange={(e) => setForm({ ...form, target_weight_kg: e.target.value })}
                placeholder="Masukkan target berat badan"
                min="0"
                max="300"
                className="w-full border-2 border-green-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              />
            </div>
          </div>

          {/* Konsumsi Makan */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-1.5">Konsumsi Makan</label>
            <div className="relative">
              <select
                value={form.diet_type}
                onChange={(e) => setForm({ ...form, diet_type: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all bg-white appearance-none cursor-pointer"
              >
                {KONSUMSI_MAKAN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={!loading ? onClose : undefined}
              disabled={loading}
              className="flex-1 py-3 text-sm font-bold text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors uppercase tracking-widest disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 text-sm font-bold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-colors flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-green-200"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Save Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
