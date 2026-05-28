'use client';

import { User } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase/client';
import Header from '../konsultasiUser/ui/header/page';
import BtnSet from './ui/setBtn/page';
import SideBar from './ui/sidBar/page';
import Main from './ui/main/page';
import TargetPage from './ui/target/page';
import PersonalHealth from './ui/healthPersonal/page';

export interface UserProfileData {
  fullName: string;
  email: string;
  height: number;
  weight: number;
  age: number;
  photoUrl: string | null;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<UserProfileData>({
    fullName: '',
    email: '',
    height: 0,
    weight: 0,
    age: 0,
    photoUrl: null,
  });

  const fetchProfile = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    const uid = session.user.id;
    const [{ data: userData }, { data: profile }] = await Promise.all([
      supabase.from('users').select('full_name, email').eq('id', uid).single(),
      supabase.from('user_profiles').select('height_cm, weight_kg, age, photo_url').eq('user_id', uid).single(),
    ]);

    setProfileData({
      fullName: userData?.full_name ?? '',
      email: userData?.email ?? '',
      height: profile?.height_cm ?? 0,
      weight: profile?.weight_kg ?? 0,
      age: profile?.age ?? 0,
      photoUrl: profile?.photo_url ?? null,
    });
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="w-full min-h-screen bg-white px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 mt-4 sm:mt-8 md:mt-16 lg:mt-20 pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-8 sm:pb-10 md:pb-12">
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 sm:gap-6">
        <Header icon={<User size={40} />} title="Profile" subTitle="Kelola identitas dan tujuan anda" />
        <BtnSet onSaved={fetchProfile} /> {/* ← pass fetchProfile */}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-6 sm:mt-8 md:mt-10 max-w-7xl mx-auto">
        <SideBar profileData={profileData} />
        <div className="flex-1 w-full">
          <Main profileData={profileData} /> {/* ← pass data real */}
          <TargetPage />
          <PersonalHealth />
        </div>
      </div>
    </div>
  );
}
