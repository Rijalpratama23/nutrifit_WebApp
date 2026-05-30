'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Plus } from 'lucide-react';
import HeaderKonsul from './ui/header/page';
import TabNavigation from './ui/tabNavigations/page';
import ContainerCard from './ui/containerCard/page';
import ModalCariAhli from './ui/ModalSearchAhli/page';

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

export default function PageKonsultasi() {
  const [activeTab, setActiveTab] = useState<'aktif' | 'riwayat'>('aktif');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchConsultations = useCallback(async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoading(false);
      return;
    }

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
          users ( full_name )
        )
      `,
      )
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
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
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const filteredData = consultations.filter((c) => {
    if (activeTab === 'aktif') {
      return ['confirmed', 'ongoing', 'pending'].includes(c.status);
    }
    return ['completed', 'cancelled'].includes(c.status);
  });

  return (
    <div className="px-4 mt-5 md:mt-20 sm:px-6 md:px-8 lg:px-12 pt-6 sm:pt-8 md:pt-10 pb-8">
      {/* Header + Tombol Cari Ahli */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <HeaderKonsul title="Konsultasi Saya" subTitle="Konsultasikan masalah anda dengan ahli" />
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex-shrink-0 mt-1">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Cari Ahli</span>
        </button>
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <ContainerCard consultations={filteredData} loading={loading} onRefresh={fetchConsultations} />

      {/* Modal Cari Ahli */}
      <ModalCariAhli isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchConsultations} />
    </div>
  );
}
