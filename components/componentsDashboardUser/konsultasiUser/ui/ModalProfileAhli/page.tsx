'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { X, BadgeCheck, Briefcase, GraduationCap } from 'lucide-react';

interface AhliProfile {
  id: string;
  specialization: string;
  experience_years: number;
  description: string | null;
  profile_photo_url: string | null;
  is_verified: boolean;
  users: {
    full_name: string;
    email: string;
  };
}

interface AhliEducation {
  id: string;
  judul: string;
  institusi: string;
  jenjang: string;
  gelar: string | null;
  tahun_mulai: string;
  tahun_selesai: string | null;
}

interface AhliExperience {
  id: string;
  judul: string;
  tempat: string;
  tahun_mulai: string;
  tahun_selesai: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ahliId: string;
  onConsult?: () => void; // opsional: tombol "Mulai Konsultasi"
}

function formatPeriod(start: string, end: string | null) {
  const fmt = (d: string) => {
    const parts = d.split('-');
    return `${parts[0]}-${parts[1] ?? '01'}`;
  };
  return `${fmt(start)} – ${end ? fmt(end) : 'Sekarang'}`;
}

function StatCard({ value, unit, label }: { value: React.ReactNode; unit?: string; label: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
      <p className="text-xl font-bold text-gray-900 leading-tight truncate">
        {value}
        {unit && <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>}
      </p>
      <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest font-medium">{label}</p>
    </div>
  );
}

function TimelineItem({ title, subtitle, period }: { title: string; subtitle: string; period: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
        <div className="w-px flex-1 bg-gray-100 mt-1" />
      </div>
      <div className="pb-4 last:pb-0">
        <p className="text-xs text-gray-400 mb-0.5">{period}</p>
        <p className="text-sm font-semibold text-gray-800 leading-snug">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

export default function ModalProfilAhli({ isOpen, onClose, ahliId, onConsult }: Props) {
  const [profile, setProfile] = useState<AhliProfile | null>(null);
  const [education, setEducation] = useState<AhliEducation[]>([]);
  const [experience, setExperience] = useState<AhliExperience[]>([]);
  const [totalConsultasi, setTotalConsultasi] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !ahliId) return;
    setImgError(false);

    const fetchData = async () => {
      setLoading(true);

      const { data: profileData } = await supabase
        .from('ahli_profiles')
        .select(
          `
          id, specialization, experience_years, description,
          profile_photo_url, is_verified,
          users ( full_name, email )
        `,
        )
        .eq('id', ahliId)
        .single();

      if (profileData) setProfile(profileData as unknown as AhliProfile);

      const { data: eduData } = await supabase.from('ahli_education').select('id, judul, institusi, jenjang, gelar, tahun_mulai, tahun_selesai').eq('ahli_id', ahliId).order('tahun_mulai', { ascending: false });

      console.log('[ahli_education] ahliId:', ahliId, 'data:', eduData);
      if (eduData) setEducation(eduData);

      const { data: expData } = await supabase.from('ahli_experience').select('id, judul, tempat, tahun_mulai, tahun_selesai').eq('ahli_id', ahliId).order('tahun_mulai', { ascending: false });

      if (expData) setExperience(expData);

      const { count } = await supabase.from('consultations').select('id', { count: 'exact', head: true }).eq('ahli_id', ahliId).eq('status', 'completed');

      setTotalConsultasi(count ?? 0);
      setLoading(false);
    };

    fetchData();
  }, [isOpen, ahliId]);

  if (!isOpen) return null;

  const fullName = profile?.users?.full_name ?? '-';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const showPhoto = !!profile?.profile_photo_url && !imgError;

  // Ambil gelar dari field_of_study atau degree pendidikan terakhir
  const gelar = education[0]?.gelar ?? '-';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-700 tracking-wide">Profil Ahli</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" aria-label="Tutup modal">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Konten */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Avatar + nama */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-emerald-200">
                  {showPhoto ? <img src={profile!.profile_photo_url!} alt={fullName} className="w-full h-full object-cover" onError={() => setImgError(true)} /> : <span className="text-emerald-600 font-bold text-base">{initials}</span>}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-gray-900 text-base leading-tight">{fullName}</p>
                    {profile?.is_verified && <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">{profile?.users?.email}</p>
                  <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                </div>
              </div>

              {/* Stat cards: gelar, pengalaman, konsultasi */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <StatCard value={gelar} label="Gelar" />
                <StatCard value={profile?.experience_years ?? 0} unit="thn" label="Pengalaman" />
                <StatCard value={totalConsultasi} label="Konsultasi" />
              </div>

              {/* Spesialisasi */}
              <div className="flex items-center justify-between py-3 border-y border-gray-100 mb-5">
                <div className="flex items-center gap-2 text-gray-400">
                  <BadgeCheck className="w-4 h-4" />
                  <span className="text-sm text-gray-600">Spesialis</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{profile?.specialization ?? '-'}</span>
              </div>

              {/* Pengalaman Profesional */}
              {experience.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-emerald-500" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Pengalaman Profesional</p>
                  </div>
                  <div>
                    {experience.map((exp) => (
                      <TimelineItem key={exp.id} period={`${exp.tahun_mulai} – ${exp.tahun_selesai ?? 'Sekarang'}`} title={exp.judul} subtitle={exp.tempat} />
                    ))}
                  </div>
                </div>
              )}

              {/* Pendidikan */}
              {education.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Pendidikan</p>
                  </div>
                  <div>
                    {education.map((edu) => (
                      <TimelineItem key={edu.id} period={`${edu.tahun_mulai} – ${edu.tahun_selesai ?? 'Sekarang'}`} title={edu.judul} subtitle={`${edu.institusi} · ${edu.jenjang}${edu.gelar ? ` · ${edu.gelar}` : ''}`} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {/* Footer tombol */}
        {onConsult && (
          <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
            <button onClick={onConsult} className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors">
              Mulai Konsultasi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
