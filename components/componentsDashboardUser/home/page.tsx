'use client';

import Image from 'next/image';
import ButtonXl from '@/components/button/buttonXl/page';
import { useState, useEffect } from 'react';
import { Calendar} from 'lucide-react';
import ButtonSecond from '@/components/button/secondaryButton/page';
import Footer from '@/components/footer/page';
import { useUser } from '@/hooks/useUser';
import ProgramSec from './ui/programsec/page';

export default function DashboardUser() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useUser();

  const slides = [
    {
      id: 1,
      title: 'Konsultasi Sekarang!',
      desc: 'Panduan Personal ahli gizi dan sesuai data dan tujuan pengguna',
      img: '/landingPage/hero.png',
    },
    {
      id: 2,
      title: 'Program Nutrisi',
      desc: 'Ikuti program kesehatan yang dirancang khusus untuk Anda',
      img: '/landingPage/hero.png',
    },
    {
      id: 3,
      title: 'Rencana Makan',
      desc: 'Atur jadwal makan harianmu dengan lebih teratur',
      img: '/landingPage/hero.png',
    },
  ];

  //logic autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center pt-20 pb-10 ">
        <div className="relative w-full max-w-4xl px-4 overflow-hidden">
          <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide) => (
              <div key={slide.id} className="min-w-full p-6">
                <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-shadow duration-300">
                  <div className="content text-left max-w-md">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">{slide.title}</h1>
                    <p className="text-lg text-gray-600 mb-8">{slide.desc}</p>
                    <ButtonXl title={slide.title} />
                  </div>
                  <div className="relative w-64 h-64">
                    <Image src={slide.img} alt="hero-image" fill className="object-contain" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 md:gap-3 mt-6 md:mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 transition-all duration-300 rounded-full shadow-xl ${currentSlide === index ? 'w-8 bg-primary shadow-lg' : 'w-3 bg-blue-300 opacity-50 shadow-lg'}`}
              aria-label={`slide-${index}`}
            />
          ))}
        </div>
      </div>

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
