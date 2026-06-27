'use client';

import { Calendar } from 'lucide-react';
import ButtonSecDashboard from '@/components/button/buttonSecDashboard/page';
import Footer from '@/components/footer/page';
import { useUser } from '@/hooks/useUser';
import ProgramSec from './ui/programsec/page';
import HeroCarousel from './ui/carrousel/page';

export default function DashboardUser() {
  const { user } = useUser();

  return (
    <main className="w-full bg-white pt-20">
      {' '}
      {/* ← TAMBAH INI: pt-20 */}
      <HeroCarousel />
      {/* Konsultasi Section */}
      <section className="konsultasi bg-primary pb-6 sm:pb-8 md:pb-10 lg:pb-12">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 text-white">
          <div className="px-2 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Heading */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">Selamat Datang di Nutrifit {user?.nama ? `, ${user.nama}` : 'Users'}</h1>
            <p className="text-xs sm:text-sm md:text-base text-green-100 mt-1 sm:mt-2">Mari kita mulai perjalanan sehat anda hari ini!</p>

            {/* Cards Container */}
            <div className="flex justify-center px-0 sm:px-2 md:px-4 mt-4 sm:mt-6 md:mt-8 lg:mt-10">
              <div className="w-full max-w-6xl">
                {/* Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="card bg-light rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col">
                      <div className="flex-1">
                        {/* Card header */}
                        <div className="flex gap-2 sm:gap-3 items-center mb-3 sm:mb-4">
                          <Calendar size={20} className="text-secondary flex-shrink-0 sm:w-6 sm:h-6" />
                          <p className="text-black font-semibold text-base sm:text-lg md:text-xl leading-tight">Konsultasi</p>
                        </div>

                        {/* Card body text */}
                        <div className="text-black font-normal text-sm sm:text-base mb-4 sm:mb-6">
                          <p>Konsultasi sekarang juga</p>
                        </div>
                      </div>

                      {/* Card button */}
                      <div className="flex justify-center sm:justify-start">
                        <ButtonSecDashboard text="Konsultasi" background="bg-secondary" destination="/user/konsultasi" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Programs Section */}
      <ProgramSec />
      {/* Footer */}
      <Footer logoSrc="/logoPutih.png" logoAlt="picture" accentColor="bg-white" background="bg-primary" textColor="text-white" />
    </main>
  );
}
