'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { X, Star, CheckCircle, Search, UserPlus } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ahli {
  id: string;
  user_id: string;
  specialization: string;
  experience_years: number;
  description: string;
  profile_photo_url: string | null;
  is_verified: boolean;
  full_name: string;
}

interface ModalCariAhliProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ─── Komponen ─────────────────────────────────────────────────────────────────

export default function ModalCariAhli({ isOpen, onClose, onSuccess }: ModalCariAhliProps) {
  const [ahliList, setAhliList] = useState<Ahli[]>([]);
  const [filtered, setFiltered] = useState<Ahli[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    fetchAhli();
  }, [isOpen]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(ahliList.filter((a) => a.full_name.toLowerCase().includes(q) || a.specialization.toLowerCase().includes(q)));
  }, [search, ahliList]);

  const fetchAhli = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ahli_profiles')
      .select(
        `
        id,
        user_id,
        specialization,
        experience_years,
        description,
        profile_photo_url,
        is_verified,
        users (
          full_name
        )
      `,
      )
      .eq('is_verified', true);

    if (!error && data) {
      const mapped: Ahli[] = data.map((a: any) => ({
        id: a.id,
        user_id: a.user_id,
        specialization: a.specialization,
        experience_years: a.experience_years,
        description: a.description,
        profile_photo_url: a.profile_photo_url,
        is_verified: a.is_verified,
        full_name: a.users?.full_name ?? 'Nama tidak tersedia',
      }));
      setAhliList(mapped);
      setFiltered(mapped);
    }
    setLoading(false);
  };

  const handleRequest = async (ahli: Ahli) => {
    setRequesting(ahli.id);
    setError(null);
    setSuccess(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      setError('Sesi tidak ditemukan. Silakan login ulang.');
      setRequesting(null);
      return;
    }

    // Cek apakah sudah ada konsultasi aktif dengan ahli ini
    const { data: existing } = await supabase.from('consultations').select('id').eq('user_id', session.user.id).eq('ahli_id', ahli.id).in('status', ['pending', 'active', 'scheduled']).single();

    if (existing) {
      setError(`Anda sudah memiliki konsultasi aktif dengan ${ahli.full_name}.`);
      setRequesting(null);
      return;
    }

    // Buat konsultasi baru
    const { error: insertError } = await supabase.from('consultations').insert({
      user_id: session.user.id,
      ahli_id: ahli.id,
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    setRequesting(null);

    if (insertError) {
      setError('Gagal mengirim request. Coba lagi.');
      return;
    }

    setSuccess(`Request konsultasi ke ${ahli.full_name} berhasil dikirim!`);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Cari Ahli</h2>
            <p className="text-xs text-gray-400 mt-0.5">Pilih ahli gizi untuk konsultasi Anda</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau spesialisasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Error / Success */}
        {error && <div className="mx-6 mb-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">⚠️ {error}</div>}
        {success && <div className="mx-6 mb-2 px-4 py-2.5 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700">✅ {success}</div>}

        {/* List Ahli */}
        <div className="overflow-y-auto flex-1 px-6 pb-6 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm font-medium">Ahli tidak ditemukan</p>
            </div>
          ) : (
            filtered.map((ahli) => (
              <div key={ahli.id} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all duration-200">
                {/* Avatar */}
                {ahli.profile_photo_url ? (
                  <img src={ahli.profile_photo_url} alt={ahli.full_name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-primary">{ahli.full_name.charAt(0)}</span>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{ahli.full_name}</h3>
                    {ahli.is_verified && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-primary font-medium mt-0.5">{ahli.specialization}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{ahli.experience_years} tahun pengalaman</span>
                  </div>
                  {ahli.description && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{ahli.description}</p>}
                </div>

                {/* Tombol Request */}
                <button
                  onClick={() => handleRequest(ahli)}
                  disabled={requesting === ahli.id}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white text-xs font-semibold rounded-xl transition-colors flex-shrink-0"
                >
                  {requesting === ahli.id ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {requesting === ahli.id ? 'Mengirim...' : 'Request'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
