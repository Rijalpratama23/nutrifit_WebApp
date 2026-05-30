'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase/client';
import HeaderKonsul from './ui/header/page';
import TabNavigation from './ui/tabNavigations/page';
import ContainerCard from './ui/containerCard/page';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Consultation {
  id: string;
  ahli_id: string;
  status: string;
  scheduled_at: string | null;
  created_at: string;
  completed_at: string | null;
  ahli_name: string;
  ahli_specialization: string;
  ahli_photo_url: string | null;
}

// ─── Komponen ─────────────────────────────────────────────────────────────────

export default function PageKonsultasi() {
  const [activeTab, setActiveTab] = useState<'aktif' | 'riwayat'>('aktif');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultations = useCallback(async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setLoading(false);
      return;
    }

    const uid = session.user.id;

    // Ambil semua konsultasi milik user beserta data ahli
    const { data, error } = await supabase
      .from('consultations')
      .select(
        `
        id,
        ahli_id,
        status,
        scheduled_at,
        created_at,
        completed_at,
        ahli_profiles (
          specialization,
          profile_photo_url,
          users (
            full_name
          )
        )
      `,
      )
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    // Flatten data
    const mapped: Consultation[] = data.map((c: any) => ({
      id: c.id,
      ahli_id: c.ahli_id,
      status: c.status,
      scheduled_at: c.scheduled_at,
      created_at: c.created_at,
      completed_at: c.completed_at,
      ahli_name: c.ahli_profiles?.users?.full_name ?? 'Nama tidak tersedia',
      ahli_specialization: c.ahli_profiles?.specialization ?? '-',
      ahli_photo_url: c.ahli_profiles?.profile_photo_url ?? null,
    }));

    setConsultations(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // Filter berdasarkan tab
  const filteredData = consultations.filter((c) => {
    if (activeTab === 'aktif') {
      return c.status === 'active' || c.status === 'scheduled' || c.status === 'pending';
    }
    return c.status === 'completed' || c.status === 'cancelled';
  });

  return (
    <div className="px-4 mt-5 md:mt-20 sm:px-6 md:px-8 lg:px-12 pt-6 sm:pt-8 md:pt-10 pb-8">
      <HeaderKonsul title="Konsultasi Saya" subTitle="Konsultasikan masalah anda dengan ahli" />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <ContainerCard consultations={filteredData} loading={loading} onRefresh={fetchConsultations} />
    </div>
  );
}
