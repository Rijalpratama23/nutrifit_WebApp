'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '../konsultasiUser/ui/header/page';
import { Stethoscope, Flame, Utensils } from 'lucide-react';
import DatePicker from './ui/calendar/page.';
import { useState } from 'react';

export default function PageNutrisi() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log('Tanggal dipilih:', date);
  };
  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 mt-4 sm:mt-5 md:mt-20 pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-6 sm:pb-8">
      <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
        <Header icon={<Stethoscope size={40} className="w-8 sm:w-10 md:w-12 lg:w-[40px]" />} title="Rencana Nutrisi" subTitle="Rencanan Nutrisi berdasarkan data kesehatan anda" />
        <DatePicker onDateSelect={handleDateSelect} />
      </div>

      {/* sectionSeccond */}
      <div className="w-full shadow-2xl mt-5 p-3 sm:p-4 md:p-5 rounded-2xl">
        <div>
          <div className="flex gap-2 items-center">
            <div className="flame text-orange-500 bg-orange-200 p-2 rounded-sm">
              <Flame size={20} />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg">Ringkasan Nutrisi (Rencana) </h3>
          </div>
        </div>

        {/* card info kallories */}
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mr-1 sm:mr-3">
          <div className="bg-orange-200 w-full sm:w-1/2 lg:w-60 mt-4 sm:mt-5 md:mt-7 p-3 rounded-xl">
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-orange-500 tracking-widest">Kalori</h4>
              <div className="flex gap-2 items-center pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-widest">3300</h1>
                <p className="text-xs sm:text-sm pt-2 tracking-widest font-bold text-gray-100">KCAL</p>
              </div>
              <hr className="border-t-3 border-orange-400" />
            </div>
          </div>

          <div className="bg-blue-200 w-full sm:w-1/2 lg:w-60 mt-4 sm:mt-5 md:mt-7 p-3 rounded-xl">
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-blue-500 tracking-widest">Protein</h4>
              <div className="flex gap-2 items-center pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-widest">180</h1>
                <p className="text-xs sm:text-sm pt-2 tracking-widest font-bold text-gray-100">G</p>
              </div>
              <hr className="border-t-3 border-blue-400" />
            </div>
          </div>

          <div className="bg-green-200 w-full sm:w-1/2 lg:w-60 mt-4 sm:mt-5 md:mt-7 p-3 rounded-xl">
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-green-500 tracking-widest">Karbo</h4>
              <div className="flex gap-2 items-center pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-widest">390</h1>
                <p className="text-xs sm:text-sm pt-2 tracking-widest font-bold text-gray-100">G</p>
              </div>
              <hr className="border-t-3 border-green-400" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 w-full sm:w-1/2 lg:w-60 mt-4 sm:mt-5 md:mt-7 p-3 rounded-xl">
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-orange-500 tracking-widest">Lemak</h4>
              <div className="flex gap-2 items-center pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-widest">121</h1>
                <p className="text-xs sm:text-sm pt-2 tracking-widest font-bold text-gray-300">G</p>
              </div>
              <hr className="border-t-3 border-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Meal Plan */}
      <div className="w-full shadow-2xl mt-5 sm:mt-8 md:mt-15 p-3 sm:p-4 md:p-5 rounded-2xl ">
        <div>
          <div className="flex gap-2 items-center">
            <div className="bg-green-200 p-2 rounded-sm text-green-600">
              <Utensils size={20} />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg">Contoh Meal Plan</h3>
          </div>

          <div className="flex gap-2 sm:gap-3 md:gap-20 md:justify-center flex-wrap">
            {/* card */}
            <div className="mt-4 sm:mt-5 w-full sm:w-1/2 lg:w-auto rounded-xl bg-white shadow">
              <p className="bg-orange-400 p-2 text-center rounded-t-xl text-xs sm:text-sm">Breakfast</p>
              <Image src="/makanan.png" alt="picture" width={205} height={20} className="w-full h-auto" />
              <p className="font-semibold p-3 text-center text-xs sm:text-sm">Oatmeal + Telor rebus</p>
            </div>

            <div className="mt-4 sm:mt-5 w-full sm:w-1/2 lg:w-auto rounded-xl bg-white shadow">
              <p className="bg-blue-400 p-2 text-center rounded-t-xl text-xs sm:text-sm">Lunch</p>
              <Image src="/makanan.png" alt="picture" width={205} height={20} className="w-full h-auto" />
              <p className="font-semibold p-3 text-center text-xs sm:text-sm">Oatmeal + Telor rebus</p>
            </div>

            <div className="mt-4 sm:mt-5 w-full sm:w-1/2 lg:w-auto rounded-xl bg-white shadow">
              <p className="bg-green-400 p-2 text-center rounded-t-xl text-xs sm:text-sm">Dinner</p>
              <Image src="/makanan.png" alt="picture" width={205} height={20} className="w-full h-auto" />
              <p className="font-semibold p-3 text-center text-xs sm:text-sm">Oatmeal + Telor rebus</p>
            </div>

            <div className="mt-4 sm:mt-5 w-full sm:w-1/2 lg:w-auto rounded-xl bg-white shadow">
              <p className="bg-yellow-400 p-2 text-center rounded-t-xl text-xs sm:text-sm">Snack</p>
              <Image src="/makanan.png" alt="picture" width={205} height={20} className="w-full h-auto" />
              <p className="font-semibold p-3 text-center text-xs sm:text-sm">Oatmeal + Telor rebus</p>
            </div>
          </div>
        </div>
      </div>

      {/* card */}
      <div className="w-full shadow-2xl mt-5 sm:mt-8 md:mt-15 p-3 sm:p-4 md:p-5 rounded-2xl">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-0">
          <div className="w-full md:w-auto">
            <div>
              <div className="flex gap-2 items-center">
                <div className="text-primary bg-blue-200 p-2 rounded-lg">
                  <Stethoscope size={20} />
                </div>
                <p className="text-sm sm:text-base">Tips dari Ahli Gizi</p>
              </div>
            </div>
            <div className="md:ml-15 mt-3 sm:mt-4 md:mt-5 space-y-1 sm:space-y-2">
              <li className="text-primary text-sm sm:text-base">Konsumsi di setiap waktu makan</li>
              <li className="text-primary text-sm sm:text-base">Hindari gula berlebih</li>
              <li className="text-primary text-sm sm:text-base">Perbanyak makan sayuran dan serat</li>
            </div>
          </div>
          <div className="flex justify-center md:justify-end mr-0 md:mr-15">
            <Image src="/dokter.png" alt="picture" width={200} height={15} className="w-32 sm:w-40 md:w-auto h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
