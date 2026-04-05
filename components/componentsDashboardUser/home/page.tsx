'use client';

import { Calendar} from 'lucide-react';
import ButtonSecond from '@/components/button/secondaryButton/page';
import Footer from '@/components/footer/page';
import { useUser } from '@/hooks/useUser';
import ProgramSec from './ui/programsec/page';
import HeroCarousel from './ui/carrousel/page';

export default function DashboardUser() {
  const { user } = useUser();


  return (
    <div className="">
      <HeroCarousel />

      <section className="konsultasi bg-primary pb-6 md:pb-8">
        <div className="p-5 md:p-8 text-white">
          <div className="px-2 md:px-5">
            <h1 className="text-xl md:text-3xl font-semibold">Selamat Datang di Nutrifit {user?.name ? `,${user.name}` : '@Users'}</h1>
            <p className="text-sm md:text-base text-shadow-white">Mari kita mulai perjalanan sehat anda hari ini!</p>
          </div>

          <div className="flex justify-center px-2 md:px-5 mt-6 md:mt-10">
            <div className="w-full max-w-screen-lg">
              <div className="flex flex-col md:flex-row md:justify-center md:items-stretch gap-6 md:gap-8">
                {/* three cards */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="cart flex-1 flex justify-center items-center bg-light p-4 md:p-6 rounded-xl">
                    <div className="w-full max-w-md">
                      <div className="flex gap-3 items-center">
                        <Calendar size={25} className="text-secondary" />
                        <p className="text-black font-semibold text-lg md:text-xl">Konsultasi</p>
                      </div>
                      <div className="text-black font-normal my-4 md:my-8">
                        <p>konsultasi sekarang juga</p>
                      </div>
                      <div className="flex justify-center items-center">
                        <ButtonSecond text="Konsultasi" background="bg-secondary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

     <ProgramSec />

      <Footer logoSrc="/logoPutih.png" logoAlt="picture" accentColor="bg-white" background="bg-primary" textColor="text-white" />
    </div>
  );
}
