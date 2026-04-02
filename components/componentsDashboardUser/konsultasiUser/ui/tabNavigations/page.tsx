import Link from "next/link";
import { FileClock, BookOpenCheck } from "lucide-react"


export default function TabNavigation() {
  return (
    <div className="bg-primary flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 sm:gap-6 md:gap-8 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl mb-8 sm:mb-10 w-full md:w-65">
      <div className="flex text-white gap-2 items-center cursor-pointer hover:text-black hover:bg-white px-3 py-2 hover:rounded-lg transition-all duration-200 whitespace-nowrap">
        <BookOpenCheck size={16} className="sm:w-4 sm:h-4" />
        <Link href="/aktif" className="text-sm sm:text-base font-medium">
          Aktif
        </Link>
      </div>

      <div className="hidden sm:flex text-white gap-2 items-center cursor-pointer hover:text-black hover:bg-white px-3 py-2 hover:rounded-lg transition-all duration-200">
        <FileClock size={16} />
        <Link href="/riwayat" className="text-sm sm:text-base font-medium">
          Riwayat
        </Link>
      </div>

      <div className="flex sm:hidden text-white gap-2 items-center cursor-pointer hover:text-black hover:bg-white px-3 py-2 hover:rounded-lg transition-all duration-200 whitespace-nowrap">
        <FileClock size={16} className="sm:w-4 sm:h-4" />
        <Link href="/riwayat" className="text-sm sm:text-base font-medium">
          Riwayat
        </Link>
      </div>
    </div>
  );
}
