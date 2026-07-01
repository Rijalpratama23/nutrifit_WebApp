'use client';

import { X, User, Mail, Calendar, MessageSquare, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

type DetailData = {
  id: string;
  user_name: string;
  user_email: string;
  user_photo: string | null;
  keluhan: string | null;
  created_at: string;
  completed_at: string | null;
  last_message: string | null;
};

type Props = {
  consultationId: string | null;
  onClose: () => void;
};

const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function DetailModal({ consultationId, onClose }: Props) {
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!consultationId) return;

    const fetchDetail = async () => {
      setLoading(true);

      // Fetch consultation + user info
      const { data: konsultasi, error } = await supabase
        .from('consultations')
        .select(
          `
          id,
          keluhan,
          created_at,
          completed_at,
          users!consultations_user_id_fkey(full_name, email)
        `,
        )
        .eq('id', consultationId)
        .single();

      if (error || !konsultasi) {
        setLoading(false);
        return;
      }

      // Fetch user photo dari user_profiles
      const userEmail = (konsultasi.users as any)?.email;
      let userPhoto = null;

      if (userEmail) {
        const { data: userRow } = await supabase.from('users').select('id').eq('email', userEmail).single();

        if (userRow?.id) {
          const { data: profile } = await supabase.from('user_profiles').select('photo_url').eq('user_id', userRow.id).single();
          userPhoto = profile?.photo_url ?? null;
        }
      }

      // Fetch pesan terakhir dari ahli
      const { data: messages } = await supabase.from('consultation_messages').select('message_text, sent_at, sender_id').eq('consultation_id', consultationId).order('sent_at', { ascending: false }).limit(1);

      const lastMessage = messages?.[0]?.message_text ?? null;

      setData({
        id: konsultasi.id,
        user_name: (konsultasi.users as any)?.full_name ?? 'User',
        user_email: (konsultasi.users as any)?.email ?? '-',
        user_photo: userPhoto,
        keluhan: konsultasi.keluhan ?? null,
        created_at: konsultasi.created_at,
        completed_at: konsultasi.completed_at,
        last_message: lastMessage,
      });

      setLoading(false);
    };

    fetchDetail();
  }, [consultationId]);

  if (!consultationId) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>

        <h2 className="text-base font-bold text-gray-800 mb-5">Detail Konsultasi</h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data ? (
          <div className="flex flex-col gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                {data.user_photo ? <img src={data.user_photo} alt={data.user_name} className="w-full h-full object-cover" /> : <User size={20} className="text-gray-400" />}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{data.user_name}</p>
                <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                  <Mail size={11} />
                  {data.user_email}
                </p>
              </div>
            </div>

            {/* Keluhan */}
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Keluhan</p>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <p className="text-sm text-gray-700 leading-relaxed">{data.keluhan ?? <span className="text-gray-400 italic">Tidak ada keluhan tercatat</span>}</p>
              </div>
            </div>

            {/* Tanggal */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mulai Konsultasi</p>
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl p-2.5">
                  <Calendar size={13} className="text-primary flex-shrink-0" />
                  <p className="text-xs text-gray-700">{formatDate(data.created_at)}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Selesai</p>
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl p-2.5">
                  <Clock size={13} className="text-green-500 flex-shrink-0" />
                  <p className="text-xs text-gray-700">{formatDate(data.completed_at)}</p>
                </div>
              </div>
            </div>

            {/* Pesan Terakhir */}
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pesan Terakhir</p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-start gap-2">
                <MessageSquare size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 leading-relaxed">{data.last_message ?? <span className="text-gray-400 italic">Tidak ada pesan</span>}</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-end">
              <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">✓ Konsultasi Selesai</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400 py-8">Data tidak ditemukan</p>
        )}
      </div>
    </div>
  );
}
