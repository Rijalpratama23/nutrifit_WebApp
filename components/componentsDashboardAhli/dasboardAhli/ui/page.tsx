'use client';

import { useCallback, useState, useEffect } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { supabase } from '@/utils/supabase/client';
import HeaderKomponents from './header/page';
import StatisticCard from './statCart/page';
import TdataUser from './tabelData/page';
import type { KonsultasiItem } from '@/hooks/useAhliDashboard';

export default function ContainerDashboard() {
  const { isCollapsed, isMobile } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ permintaanBaru: 0, konsultasiAktif: 0, selesai: 0 });
  const [konsultasiTerbaru, setKonsultasiTerbaru] = useState<KonsultasiItem[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoading(false);
      return;
    }

    // ✅ Ambil ahli_profiles.id dulu
    const { data: ahliProfile } = await supabase.from('ahli_profiles').select('id').eq('user_id', session.user.id).eq('is_verified', true).maybeSingle();

    if (!ahliProfile) {
      setLoading(false);
      return;
    }

    const ahliId = ahliProfile.id; // ✅ pakai ahli_profiles.id

    const [{ count: permintaanBaru }, { count: konsultasiAktif }, { count: selesai }, { data: terbaru }] = await Promise.all([
      supabase.from('consultations').select('*', { count: 'exact', head: true }).eq('ahli_id', ahliId).eq('status', 'pending'),
      supabase.from('consultations').select('*', { count: 'exact', head: true }).eq('ahli_id', ahliId).in('status', ['confirmed', 'ongoing']),
      supabase.from('consultations').select('*', { count: 'exact', head: true }).eq('ahli_id', ahliId).eq('status', 'completed'),
      supabase.from('consultations').select(`id, status, created_at, scheduled_at, users!consultations_user_id_fkey(full_name, email)`).eq('ahli_id', ahliId).eq('status', 'pending').order('created_at', { ascending: false }).limit(7),
    ]);

    setStats({
      permintaanBaru: permintaanBaru ?? 0,
      konsultasiAktif: konsultasiAktif ?? 0,
      selesai: selesai ?? 0,
    });

    setKonsultasiTerbaru(
      (terbaru ?? []).map((item: any) => ({
        id: item.id,
        user_name: item.users?.full_name ?? 'User',
        user_email: item.users?.email ?? '',
        status: item.status,
        created_at: item.created_at,
        scheduled_at: item.scheduled_at,
      })),
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className={`flex-1 min-h-screen transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        <HeaderKomponents />
        <StatisticCard permintaanBaru={stats.permintaanBaru} konsultasiAktif={stats.konsultasiAktif} selesai={stats.selesai} />
        <TdataUser data={konsultasiTerbaru} loading={loading} onRefresh={fetchData} />
      </div>
    </div>
  );
}
