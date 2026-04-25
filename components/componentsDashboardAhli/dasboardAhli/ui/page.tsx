'use client';

import { useSidebar } from '@/hooks/useSidebar';
import HeaderKomponents from './header/page';
import StatisticCard from './statCart/page';
import TdataUser from './tabelData/page';

export default function ContainerDashboard() {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div
      className={`flex-1 min-h-screen transition-all duration-300 ${
        isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'
      }`}
    >
      <div className="p-4 sm:p-6 lg:p-10">
        <HeaderKomponents />
        <StatisticCard />
        <TdataUser />
      </div>
    </div>
  );
}