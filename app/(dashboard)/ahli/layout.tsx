import { SidebarProvider } from '@/hooks/useSidebar';

export default function AhliLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}