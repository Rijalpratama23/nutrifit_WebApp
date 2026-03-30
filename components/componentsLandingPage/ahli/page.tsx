import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import ButtonSecond from '@/components/button/secondaryButton/page';

export default function timAhli() {
  return (
    <div className="py-10 md:py-15 px-6" id="tim">
      {/* Header Section */}
      <div className="text-center mt-4 md:mt-10 mb-8 md:mb-14">
        <h1 className="font-semibold text-3xl md:text-4xl text-primary">Kenali Tim Ahli</h1>
        <p className="text-primary font-light text-sm md:text-base px-4">Sesuaikan tim ahli dengan yang anda butuhkan!</p>
      </div>

      {/* Card Container - Grid System agar lebih aman */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
        {/* Card 1 */}
        <div className="w-full flex flex-col items-center p-5 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] bg-white hover:scale-105 transition-transform duration-300">
          <div className="w-full">
            <div className="relative w-full aspect-[4/3] md:h-[180px]">
              <Image src="/landingpage/doctor.jpg" alt="picture" fill className="rounded-2xl object-cover" />
            </div>
            <h4 className="text-center pt-4 font-bold text-gray-800">Dr. Adika Pratama, S.Gz</h4>
            <blockquote className="text-center italic font-light text-sm text-gray-500 pb-2 md:pb-3">Dokter Spesialis Gizi</blockquote>
            <p className="mb-5 text-center leading-5 text-gray-600 text-sm md:text-base px-2">Dokter dengan pengalaman yang mumpuni dan ahli di bidangnya.</p>

            <div className="flex justify-center pb-2">
              <ButtonSecond text="Lihat Profile" background="bg-primary" />
            </div>
          </div>
        </div>

        {/* Card 2 (Silahkan copy struktur card 1 untuk data lainnya) */}
        <div className="w-full flex flex-col items-center p-5 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] bg-white hover:scale-105 transition-transform duration-300">
          <div className="w-full text-center">
            <div className="relative w-full aspect-[4/3] md:h-[180px]">
              <Image src="/landingpage/doctor.jpg" alt="picture" fill className="rounded-2xl object-cover" />
            </div>
            <h4 className="text-center pt-4 font-bold text-gray-800">Dr. Adika Pratama, S.Gz</h4>
            <blockquote className="text-center italic font-light text-sm text-gray-500 pb-2 md:pb-3">Dokter Spesialis Gizi</blockquote>
            <p className="mb-5 text-center leading-5 text-gray-600 text-sm md:text-base px-2">Dokter dengan pengalaman yang mumpuni dan ahli di bidangnya.</p>

            <div className="flex justify-center pb-2">
              <ButtonSecond text="Lihat Profile" background="bg-primary" />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="w-full flex flex-col items-center p-5 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] bg-white hover:scale-105 transition-transform duration-300">
          <div className="w-full text-center">
            <div className="relative w-full aspect-[4/3] md:h-[180px]">
              <Image src="/landingpage/doctor.jpg" alt="picture" fill className="rounded-2xl object-cover" />
            </div>
            <h4 className="text-center pt-4 font-bold text-gray-800">Dr. Adika Pratama, S.Gz</h4>
            <blockquote className="text-center italic font-light text-sm text-gray-500 pb-2 md:pb-3">Dokter Spesialis Gizi</blockquote>
            <p className="mb-5 text-center leading-5 text-gray-600 text-sm md:text-base px-2">Dokter dengan pengalaman yang mumpuni dan ahli di bidangnya.</p>

            <div className="flex justify-center pb-2">
              <ButtonSecond text="Lihat Profile" background="bg-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* View All Section - Responsif */}
      <div className="flex justify-center md:justify-end items-center gap-4 md:mr-20 mt-10 group cursor-pointer">
        <p className="font-semibold text-primary group-hover:underline">View All</p>
        <div className="bg-primary p-2 rounded-full text-white group-hover:translate-x-2 transition-transform shadow-lg">
          <ArrowRight size={20} />
        </div>
      </div>
    </div>
  );
}
