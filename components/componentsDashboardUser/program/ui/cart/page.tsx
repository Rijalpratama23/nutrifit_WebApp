import { Calendars } from 'lucide-react';
import Image from 'next/image';
import Cta from '../btn/page';

export default function Cart() {
  return (
    <>
      {/* card */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-start sm:items-center">
          <Image src="/image.png" alt="picture" width={200} height={200} className="items-center md:items-start" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg sm:text-xl md:text-2xl">
              Program Diet Sehat <br /> & Turun Berat Badan
            </h3>
            <div className="flex items-center gap-2 sm:gap-3 mt-5 sm:mt-6 md:mt-7">
              <Calendars size={15} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <p className="text-sm sm:text-base md:text-lg">10 Bulan</p>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col justify-end sm:justify-between items-start sm:items-end gap-3 sm:gap-4">
          <div className="activeOrNote bg-green-200 py-1 px-3 sm:py-1.5 sm:px-4 rounded-lg sm:rounded-xl flex-shrink-0">
            <p className="text-secondary text-xs sm:text-sm md:text-base font-semibold">Sedang Berlangsung</p>
          </div>

          <div>
            <Cta />
          </div>
        </div>
      </div>
    </>
  );
}
