'use client';

import { SidebarProvider } from '@/hooks/useSidebar';
import { usePreventPageClose } from '@/hooks/usePreventPageClose';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  usePreventPageClose();

  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}