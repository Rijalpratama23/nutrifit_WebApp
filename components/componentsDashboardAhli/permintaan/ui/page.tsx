'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { useState, useEffect, useCallback } from 'react';
import HeaderPermin from './header/page';
import HeadT from './headT/page';
import Hr from './hr/page';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';
import { Loader2 } from 'lucide-react';

type Permintaan = {
  id: string;
  user_name: string;
  user_email: string;
  waktu: string;
  scheduled_at: string | null;
};

const COL = {
  user: 'w-[30%] px-6 py-3',
  tujuan: 'w-[30%] px-4 py-3',
  waktu: 'w-[25%] px-4 py-3',
  aksi: 'w-[15%] px-6 py-3',
};

function formatWaktu(dateStr: string) {
  const d = new Date(dateStr);
  const tgl = d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${tgl} | ${jam}`;
}

export default function ContainerPermintaan() {
  const { isCollapsed, isMobile } = useSidebar();
  const [data, setData] = useState<Permintaan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const { data: konsultasi, error } = await supabase
      .from('consultations')
      .select(
        `
        id,
        created_at,
        scheduled_at,
        users!consultations_user_id_fkey(full_name, email)
      `,
      )
      .eq('ahli_id', session.user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      showErrorToast({ title: 'Gagal', message: 'Gagal memuat data permintaan.' });
      setLoading(false);
      return;
    }

    setData(
      (konsultasi ?? []).map((item: any) => ({
        id: item.id,
        user_name: item.users?.full_name ?? 'User',
        user_email: item.users?.email ?? '',
        waktu: formatWaktu(item.created_at),
        scheduled_at: item.scheduled_at ? formatWaktu(item.scheduled_at) : null,
      })),
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from('consultations').update({ status: 'confirmed' }).eq('id', id);

    if (error) {
      showErrorToast({ title: 'Gagal', message: 'Gagal menyetujui permintaan.' });
    } else {
      showSuccessToast({ title: 'Disetujui!', message: 'Permintaan konsultasi berhasil diterima.' });
      fetchData();
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from('consultations').update({ status: 'cancelled' }).eq('id', id);

    if (error) {
      showErrorToast({ title: 'Gagal', message: 'Gagal menolak permintaan.' });
    } else {
      showSuccessToast({ title: 'Ditolak', message: 'Permintaan konsultasi berhasil ditolak.' });
      fetchData();
    }
  };

  const EmptyState = () => (
    <tr>
      <td colSpan={4} className="text-center py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="#d1d5db" />
              <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">Belum ada permintaan konsultasi</p>
          <p className="text-gray-300 text-xs">Permintaan baru dari user akan muncul di sini</p>
        </div>
      </td>
    </tr>
  );

  const LoadingState = () => (
    <tr>
      <td colSpan={4} className="text-center py-12">
        <div className="flex justify-center items-center gap-2 text-gray-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Memuat data...</span>
        </div>
      </td>
    </tr>
  );

  const ActionButtons = ({ id }: { id: string }) => (
    <div className="flex items-center justify-center gap-2">
      <button onClick={() => handleApprove(id)} title="Setujui" className="w-[26px] h-[26px] rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-green-50 transition-colors">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button onClick={() => handleReject(id)} title="Tolak" className="w-[26px] h-[26px] rounded-full border-2 border-red-500 flex items-center justify-center hover:bg-red-50 transition-colors">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        <HeaderPermin />
        <div className="bg-white rounded-2xl shadow-md w-full overflow-hidden">
          <HeadT />
          <Hr />

          {/* ── Desktop ── */}
          <div className="hidden md:block">
            <table className="w-full text-[13.5px] table-fixed">
              <thead>
                <tr>
                  <th className={`text-left text-gray-500 font-semibold ${COL.user}`}>User</th>
                  <th className={`text-left text-gray-500 font-semibold ${COL.tujuan}`}>Email</th>
                  <th className={`hidden lg:table-cell text-left text-gray-500 font-semibold ${COL.waktu}`}>Waktu</th>
                  <th className={`text-center text-gray-500 font-semibold ${COL.aksi}`}>Aksi</th>
                </tr>
              </thead>
            </table>

            <div className="max-h-[372px] overflow-y-auto">
              <table className="w-full text-[13.5px] table-fixed">
                <tbody>
                  {loading ? (
                    <LoadingState />
                  ) : data.length === 0 ? (
                    <EmptyState />
                  ) : (
                    data.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100 hover:bg-blue-50 transition-colors duration-150">
                        {/* User */}
                        <td className={COL.user}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" fill="#9e9e9e" />
                                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </div>
                            <span className="text-gray-800 font-medium truncate">{item.user_name}</span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className={`${COL.tujuan} text-gray-500 text-xs truncate`}>{item.user_email}</td>

                        {/* Waktu */}
                        <td className={`hidden lg:table-cell ${COL.waktu} text-gray-500`}>{item.waktu}</td>

                        {/* Aksi */}
                        <td className={COL.aksi}>
                          <ActionButtons id={item.id} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile ── */}
          <div className="block md:hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12 gap-2 text-gray-400">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Memuat data...</span>
              </div>
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-2 text-center px-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" fill="#d1d5db" />
                    <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm font-medium">Belum ada permintaan</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
                {data.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" fill="#9e9e9e" />
                        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-800 truncate">{item.user_name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{item.user_email}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.waktu}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button onClick={() => handleApprove(item.id)} title="Setujui" className="w-7 h-7 rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-green-50 transition-colors">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button onClick={() => handleReject(item.id)} title="Tolak" className="w-7 h-7 rounded-full border-2 border-red-500 flex items-center justify-center hover:bg-red-50 transition-colors">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <path d="M6 6l12 12M18 6L6 18" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
