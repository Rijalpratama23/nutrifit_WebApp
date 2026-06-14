// components/onboarding/OnboardingProvider.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import dynamic from 'next/dynamic';

const OnboardingModal = dynamic(() => import('./OnboardingModal'), {
  ssr: false,
});

const SKIP_KEY = 'nutrifit_onboarding_skipped';

export default function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const skipped = sessionStorage.getItem(SKIP_KEY);
        if (skipped) {
          setIsChecking(false);
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsChecking(false);
          return;
        }

        const { data: profile } = await supabase.from('profiles').select('is_profile_complete').eq('id', user.id).single();

        if (profile && profile.is_profile_complete === false) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error('Error checking onboarding:', err);
      } finally {
        setIsChecking(false);
      }
    };

    const timer = setTimeout(checkOnboardingStatus, 500);
    return () => clearTimeout(timer);
  }, [supabase]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    sessionStorage.setItem(SKIP_KEY, 'true');
  };

  return (
    <>
      {children}
      {!isChecking && showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
    </>
  );
}
