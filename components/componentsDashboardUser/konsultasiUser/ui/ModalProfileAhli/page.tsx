'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { X, BadgeCheck, Briefcase, GraduationCap, Star } from 'lucide-react';

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
  degree: string;
  institution: string;
  start_year: string;
  end_year: string | null;
  field_of_study: string | null;
}

interface AhliExperience {
  id: string;
  position: string;
  company: string;
  start_date: string;
  end_date: string | null;
}

interface ConsultationStats {
  total: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ahliId: string;
}

function formatPeriod(start: string, end: string | null) {
  const fmt = (d: string) => {
    const [year, month] = d.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };
  return `${fmt(start)} – ${end ? fmt(end) : 'Sekarang'}`;
}

export default function ModalProfilAhli({ isOpen, onClose, ahliId }: Props) {
  const [profile, setProfile] = useState<AhliProfile | null>(null);
  const [education, setEducation] = useState<AhliEducation[]>([]);
  const [experience, setExperience] = useState<AhliExperience[]>([]);
  const [stats, setStats] = useState<ConsultationStats>({ total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !ahliId) return;

    const fetchData = async () => {
      setLoading(true);

      // Profil ahli + data user
      const { data: profileData } = await supabase
        .from('ahli_profiles')
        .select(`
          id, specialization, experience_years, description,
          profile_photo_url, is_verified,
          users ( full_name, email )
        `)
        .eq('id', ahliId)
        .single();

      if (profileData) setProfile(profileData as unknown as AhliProfile);

      // Pendidikan
      const { data: eduData } = await supabase
        .from('ahli_education')
        .select('id, degree, institution, start_year, end_year, field_of_study')
        .eq('ahli_id', ahliId)
        .order('start_year', { ascending: false });

      if (eduData) setEducation(eduData);

      // Pengalaman
      const { data: expData } = await supabase
        .from('ahli_experience')
        .select('id, position, company, start_date, end_date')
        .eq('ahli_id', ahliId)
        .order('start_date', { ascending: false });

      if (expData) setExperience(expData);

      // Jumlah konsultasi selesai
      const { count } = await supabase
        .from('consultations')
        .select('id', { count: 'exact', head: true })
        .eq('ahli_id', ahliId)
        .eq('status', 'completed');

      setStats({ total: count ?? 0 });
      setLoading(false);
    };

    fetchData();
  }, [isOpen, ahliId]);

  if (!isOpen) return null;

  const initials = profile?.users?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-800">Profil Ahli</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Konten */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Info utama */}
              <div className="flex items-center gap-4 mb-5">
                {profile?.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt={profile.users?.full_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-lg">{initials}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-gray-800 text-base">
                      {profile?.users?.full_name ?? '-'}
                    </span>
                    {profile?.is_verified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{profile?.users?.email}</p>
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Online
                  </span>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    {profile?.experience_years ?? 0}
                    <span className="text-xs font-normal text-gray-500 ml-0.5">thn</span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wide">Pengalaman</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-semibold text-gray-800">{stats.total}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wide">Konsultasi</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-semibold text-gray-800 truncate text-sm">
                    {profile?.specialization ?? '-'}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wide">Spesialis</p>
                </div>
              </div>

              {/* Deskripsi */}
              {profile?.description && (
                <div className="mb-5">
                  <p className="text-sm text-gray-600 leading-relaxed">{profile.description}</p>
                </div>
              )}

              {/* Pengalaman Profesional */}
              {experience.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-gray-700">Pengalaman Profesional</h3>
                  </div>
                  <div className="space-y-3">
                    {experience.map((exp) => (
                      <div key={exp.id} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{exp.position}</p>
                          <p className="text-xs text-gray-500">{exp.company}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatPeriod(exp.start_date, exp.end_date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pendidikan */}
              {education.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-gray-700">Pendidikan</h3>
                  </div>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{edu.degree}</p>
                          <p className="text-xs text-gray-500">
                            {edu.institution}
                            {edu.field_of_study && ` · ${edu.field_of_study}`}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {edu.start_year} – {edu.end_year ?? 'Sekarang'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}