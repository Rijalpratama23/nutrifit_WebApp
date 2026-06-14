// hooks/useProfileCompletion.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export interface ProfileCompletionStatus {
  isComplete: boolean;
  isLoading: boolean;
  isNewUser: boolean;
}

export function useProfileCompletion(): ProfileCompletionStatus {
  const [isComplete, setIsComplete] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: profile, error } = await supabase.from('profiles').select('is_profile_complete, created_at').eq('id', user.id).single();

        if (error) {
          console.error('Error fetching profile:', error);
          setIsLoading(false);
          return;
        }

        if (profile) {
          setIsComplete(profile.is_profile_complete ?? false);

          // Anggap "user baru" jika dibuat dalam 5 menit terakhir
          const createdAt = new Date(profile.created_at);
          const now = new Date();
          const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
          setIsNewUser(diffMinutes < 5);
        }
      } catch (err) {
        console.error('Error checking profile completion:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileCompletion();
  }, [supabase]);

  return { isComplete, isLoading, isNewUser };
}
