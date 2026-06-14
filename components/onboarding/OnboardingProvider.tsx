// components/onboarding/OnboardingProvider.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import dynamic from 'next/dynamic';

const OnboardingModal = dynamic(() => import('./OnboardingModal'), {
  ssr: false,
});

export default function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsChecking(false);
          return;
        }

        const skipKey = `nutrifit_onboarding_skipped_${user.id}`;
        if (sessionStorage.getItem(skipKey)) {
          setIsChecking(false);
          return;
        }

        // Sumber kebenaran: flag di database
        const { data: profile, error } = await supabase.from('profiles').select('is_profile_complete').eq('id', user.id).single();

        if (error) {
          console.error('Error checking onboarding status:', error);
          setIsChecking(false);
          return;
        }

        if (profile && profile.is_profile_complete === false) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error('Error checking onboarding status:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleComplete = async () => {
    setShowOnboarding(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      sessionStorage.setItem(`nutrifit_onboarding_skipped_${user.id}`, 'true');
    }
  };

  if (isChecking) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {showOnboarding && <OnboardingModal onComplete={handleComplete} />}
    </>
  );
}
