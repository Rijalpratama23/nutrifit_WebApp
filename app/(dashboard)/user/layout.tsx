'use client';

import { usePreventPageClose } from '@/hooks/usePreventPageClose';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  usePreventPageClose();

  return (
    <>
      {children}
    </>
  );
}
