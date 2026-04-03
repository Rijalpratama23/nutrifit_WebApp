import { ChartColumnBig, BookText, Goal } from 'lucide-react';
import Link from 'next/link';

export default function TabNav() {
  return (
    <div className="bg-primary flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 sm:gap-6 md:gap-8 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl mb-8 sm:mb-10 w-full md:w-180">
      <div className="flex text-white gap-2 items-center cursor-pointer hover:text-black hover:bg-white px-3 py-2 hover:rounded-lg transition-all duration-200 whitespace-nowrap">
        <ChartColumnBig size={16} className="sm:w-4 sm:h-4" />
        <Link href="/aktif" className="text-sm sm:text-base font-medium">
          Program yang diminati
        </Link>
      </div>

      <div className="flex text-white gap-2 items-center cursor-pointer hover:text-black hover:bg-white px-3 py-2 hover:rounded-lg transition-all duration-200">
        <BookText size={16} />
        <Link href="/riwayat" className="text-sm sm:text-base font-medium">
          Detail panduan program
        </Link>
      </div>

      <div className="flex text-white gap-2 items-center cursor-pointer hover:text-black hover:bg-white px-3 py-2 hover:rounded-lg transition-all duration-200">
        <Goal size={16} />
        <Link href="/riwayat" className="text-sm sm:text-base font-medium">
          Target Dri ahli
        </Link>
      </div>
    </div>
  );
}
