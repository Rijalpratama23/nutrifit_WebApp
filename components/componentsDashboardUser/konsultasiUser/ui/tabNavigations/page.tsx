'use client';

import { FileClock, BookOpenCheck } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'aktif' | 'riwayat';
  onTabChange: (tab: 'aktif' | 'riwayat') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-primary flex flex-row items-center justify-start gap-2 py-2 px-3 rounded-xl sm:rounded-2xl mb-8 sm:mb-10 w-full md:w-60">
      {/* Tab Aktif */}
      <button
        onClick={() => onTabChange('aktif')}
        className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeTab === 'aktif' ? 'bg-white text-primary shadow-sm' : 'text-white hover:bg-white/20'}`}
      >
        <BookOpenCheck size={16} />
        Aktif
      </button>

      {/* Tab Riwayat */}
      <button
        onClick={() => onTabChange('riwayat')}
        className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeTab === 'riwayat' ? 'bg-white text-primary shadow-sm' : 'text-white hover:bg-white/20'}`}
      >
        <FileClock size={16} />
        Riwayat
      </button>
    </div>
  );
}
