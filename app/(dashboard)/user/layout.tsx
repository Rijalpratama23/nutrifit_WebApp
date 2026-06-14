'use client';

import { usePreventPageClose } from '@/hooks/usePreventPageClose';
import { ReactNode } from 'react';
import OnboardingProvider from '@/components/onboarding/OnboardingProvider';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  usePreventPageClose();

  return (
    <OnboardingProvider>
      <div className="min-h-screen flex">
        <main className="flex-1">{children}</main>
      </div>
    </OnboardingProvider>
  );
}
