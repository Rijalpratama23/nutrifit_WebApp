import { ChartColumnBig, BookText, Goal } from 'lucide-react';
import type { ProgramTab } from '../../page';

interface TabNavProps {
  activeTab: ProgramTab;
  onChange: (tab: ProgramTab) => void;
}

const tabs: Array<{ key: ProgramTab; label: string; icon: React.ReactNode }> = [
  { key: 'program', label: 'Program yang diminati', icon: <ChartColumnBig size={16} className="sm:w-4 sm:h-4" /> },
  { key: 'guide', label: 'Detail panduan program', icon: <BookText size={16} /> },
  { key: 'target', label: 'Target dari ahli', icon: <Goal size={16} /> },
];

export default function TabNav({ activeTab, onChange }: TabNavProps) {
  return (
    <div className="bg-primary flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 sm:gap-6 md:gap-8 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl mb-8 sm:mb-10 w-full md:w-180">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`flex text-white gap-2 items-center px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${isActive ? 'bg-white text-primary shadow-sm' : 'hover:text-black hover:bg-white'}`}
          >
            {tab.icon}
            <span className="text-sm sm:text-base font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
