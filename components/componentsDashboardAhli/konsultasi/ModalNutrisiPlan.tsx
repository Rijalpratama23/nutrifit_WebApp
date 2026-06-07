'use client';

import { useState } from 'react';
import { X, Save, Loader2, Flame, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';

interface ModalNutrisiPlanProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId: string;
  userId: string;
  userName: string;
}

export default function ModalNutrisiPlan({ isOpen, onClose, consultationId, userId, userName }: ModalNutrisiPlanProps) {
  const [form, setForm] = useState({
    kalori: '',
    protein_g: '',
    karbo_g: '',
    lemak_g: '',
    breakfast: '',
    lunch: '',
    dinner: '',
    snack: '',
  });
  const [tips, setTips] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);

  const handleTipChange = (index: number, value: string) => {
    const newTips = [...tips];
    newTips[index] = value;
    setTips(newTips);
  };

  const addTip = () => setTips([...tips, '']);
  const removeTip = (index: number) => setTips(tips.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!form.kalori || !form.protein_g || !form.karbo_g || !form.lemak_g) {
      showErrorToast({ title: 'Gagal', message: 'Kalori, Protein, Karbo, dan Lemak wajib diisi.' });
      return;
    }

    setLoading(true);
    try {
      const filteredTips = tips.filter((t) => t.trim() !== '');

      const { error } = await supabase.from('nutrition_plans').insert({
        user_id: userId,
        consultation_id: consultationId,
        kalori: parseInt(form.kalori),
        protein_g: parseInt(form.protein_g),
        karbo_g: parseInt(form.karbo_g),
        lemak_g: parseInt(form.lemak_g),
        breakfast: form.breakfast || 'Sesuai kebutuhan',
        lunch: form.lunch || 'Sesuai kebutuhan',
        dinner: form.dinner || 'Sesuai kebutuhan',
        snack: form.snack || 'Sesuai kebutuhan',
        tips: filteredTips.length > 0 ? filteredTips : ['Konsumsi air 8 gelas/hari', 'Hindari gula berlebih'],
      });

      if (error) throw new Error(error.message);

      showSuccessToast({
        title: 'Rencana Nutrisi Dikirim!',
        message: `Rencana nutrisi untuk ${userName} berhasil disimpan.`,
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showErrorToast({ title: 'Gagal', message: err.message });
      } else {
        showErrorToast({ title: 'Gagal', message: 'Terjadi kesalahan tidak terduga.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
            <Flame size={16} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Buat Rencana Nutrisi</h2>
            <p className="text-[11px] text-gray-400">Untuk: {userName}</p>
          </div>
          <button onClick={!loading ? onClose : undefined} className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {/* Ringkasan Nutrisi */}
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Ringkasan Nutrisi</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'kalori', label: 'Kalori', unit: 'kcal', color: 'border-orange-300 focus:border-orange-500' },
                { key: 'protein_g', label: 'Protein', unit: 'gram', color: 'border-blue-300 focus:border-blue-500' },
                { key: 'karbo_g', label: 'Karbohidrat', unit: 'gram', color: 'border-green-300 focus:border-green-500' },
                { key: 'lemak_g', label: 'Lemak', unit: 'gram', color: 'border-yellow-300 focus:border-yellow-500' },
              ].map(({ key, label, unit, color }) => (
                <div key={key}>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest block mb-1">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder="0"
                      min="0"
                      className={`w-full border-2 ${color} rounded-xl px-3 py-2.5 pr-12 text-sm font-medium outline-none focus:ring-2 focus:ring-opacity-20 transition-all`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Plan */}
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Contoh Meal Plan</p>
            <div className="space-y-3">
              {[
                { key: 'breakfast', label: '🌅 Breakfast', placeholder: 'Contoh: Oatmeal + Telur rebus' },
                { key: 'lunch', label: '☀️ Lunch', placeholder: 'Contoh: Nasi merah + Ayam bakar + Sayur' },
                { key: 'dinner', label: '🌙 Dinner', placeholder: 'Contoh: Nasi + Ikan + Tumis sayur' },
                { key: 'snack', label: '🍎 Snack', placeholder: 'Contoh: Buah + Kacang almond' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest block mb-1">{label}</label>
                  <input
                    type="text"
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Tips Ahli Gizi</p>
              <button onClick={addTip} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium">
                <Plus size={12} /> Tambah tip
              </button>
            </div>
            <div className="space-y-2">
              {tips.map((tip, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => handleTipChange(i, e.target.value)}
                    placeholder={`Tips ${i + 1}...`}
                    className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  {tips.length > 1 && (
                    <button onClick={() => removeTip(i)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={!loading ? onClose : undefined} disabled={loading} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSave} disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Kirim Rencana
          </button>
        </div>
      </div>
    </div>
  );
}
