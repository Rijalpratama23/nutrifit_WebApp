'use client';

import { CheckCircle, XCircle, User, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';
import type { KonsultasiItem } from '@/hooks/useAhliDashboard';

interface Props {
  data: KonsultasiItem[];
  loading: boolean;
  onRefresh: () => void;
}

function formatWaktu(dateStr: string) {
  const date = new Date(dateStr);
  return (
    date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }) +
    ' | ' +
    date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  );
}

export default function TdataUser({ data, loading, onRefresh }: Props) {
  const handleAccept = async (id: string) => {
    const { error } = await supabase.from('consultations').update({ status: 'confirmed' }).eq('id', id);

    if (error) {
      showErrorToast({ title: 'Gagal', message: 'Gagal menerima konsultasi.' });
    } else {
      showSuccessToast({ title: 'Berhasil', message: 'Konsultasi berhasil diterima.' });
      onRefresh();
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from('consultations').update({ status: 'cancelled' }).eq('id', id);

    if (error) {
      showErrorToast({ title: 'Gagal', message: 'Gagal menolak konsultasi.' });
    } else {
      showSuccessToast({ title: 'Ditolak', message: 'Konsultasi berhasil ditolak.' });
      onRefresh();
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm p-8 border border-white">
      <h3 className="text-xl font-bold text-slate-800 mb-4 font-sans">Permintaan Konsultasi Terbaru</h3>
      <div className="w-full h-1 bg-blue-600 rounded-full mb-8"></div>

      <div className="overflow-x-auto max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 size={28} className="animate-spin text-blue-400" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <User size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-400">Belum ada permintaan konsultasi</p>
            <p className="text-xs text-gray-300 mt-1">Permintaan baru akan muncul di sini</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-slate-400 font-bold text-sm">
                <th className="pb-6 px-4 text-center">User</th>
                <th className="pb-6 px-4">Status</th>
                <th className="pb-6 px-4 text-center">Waktu</th>
                <th className="pb-6 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                        <User size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block">{item.user_name}</span>
                        <span className="text-xs text-slate-400">{item.user_email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-600">Menunggu</span>
                  </td>
                  <td className="py-5 px-4 text-center text-slate-500 text-sm font-medium">{formatWaktu(item.created_at)}</td>
                  <td className="py-5 px-4">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleAccept(item.id)} className="text-green-500 hover:scale-110 transition-transform" title="Terima">
                        <CheckCircle size={24} />
                      </button>
                      <button onClick={() => handleReject(item.id)} className="text-red-500 hover:scale-110 transition-transform" title="Tolak">
                        <XCircle size={24} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <button className="bg-primary hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all">Lihat Detail</button>
      </div>
    </div>
  );
}
