'use client';

import { Mail, ShieldCheck, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/utils/supabase/client';
import ConfirmationLogoutModal from '@/components/logoutModal/ConfirmationsLogoutModal';
import { useState, useEffect } from 'react';
import { UserProfileData } from '../../page';

interface Props {
  profileData: UserProfileData;
}

export default function SideBar({ profileData }: Props) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => setIsModalOpen(true);
  const handleConfirmLogout = async () => {
    await supabase.auth.signOut();
    setIsModalOpen(false);
    router.push('/login');
  };

  // ── Prioritas foto: dari user_profiles → dari Google OAuth → default avatar
  const photoUrl = profileData.photoUrl || user?.phoro_url || null;

  return (
    <>
      <div className="w-full sm:w-60 lg:w-64 flex-shrink-0 md:mt-20">
        <div className="mt-6 sm:mt-8 md:mt-10 w-full py-6 sm:py-7 px-4 sm:px-5 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl h-auto bg-white">
          {/* Avatar — ambil dari profileData.photoUrl */}
          <div className="flex justify-center items-center p-3">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="avatar"
                className="rounded-full w-16 sm:w-20 h-16 sm:h-20 object-cover border-2 border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="p-3 rounded-full border w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center bg-gray-50">
                <User size={40} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Info — nama dari profileData agar sync setelah edit */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-center font-semibold text-base sm:text-lg">{loading ? '...' : profileData.fullName || user?.nama || 'User'}</h2>
            <div className="flex gap-1 items-center justify-center text-xs sm:text-sm">
              <Mail size={14} />
              <p className="tracking-widest truncate">{loading ? '...' : profileData.email || user?.email}</p>
            </div>
            <div className="w-full flex gap-1 items-center justify-center bg-green-200 text-secondary rounded-lg border border-green-600 py-2 sm:py-3">
              <ShieldCheck size={14} />
              <p className="text-xs sm:text-sm font-medium">Verified</p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs sm:text-sm font-medium">Status User</p>
              <p className="text-secondary text-xs sm:text-sm">Online</p>
            </div>
            <button onClick={handleLogout} className="flex cursor-pointer w-full justify-center items-center gap-2 bg-red-50 border border-red-500 px-4 py-2 rounded-lg text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors">
              <LogOut size={18} />
              <p>Keluar</p>
            </button>
          </div>
        </div>
      </div>

      {isMounted && <ConfirmationLogoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmLogout} />}
    </>
  );
}
