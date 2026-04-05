// components/dashboard/HeroCarousel.js
import Image from 'next/image';
import ButtonXl from '@/components/button/buttonXl/page';
import { HERO_SLIDES } from '@/lib/constant.js/carrouselHome';
import { useCarousel } from '@/lib/carrousel/useCarrousel';

export default function HeroCarousel() {
  const { currentSlide, setCurrentSlide } = useCarousel(HERO_SLIDES.length);

  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-10">
      <div className="relative w-full max-w-4xl px-4 overflow-hidden">
        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {HERO_SLIDES.map((slide) => (
            <div key={slide.id} className="min-w-full p-6">
              <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
                <div className="content text-left max-w-md">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">{slide.title}</h1>
                  <p className="text-lg text-gray-600 mb-8">{slide.desc}</p>
                  <ButtonXl title={slide.title} />
                </div>
                <div className="relative w-64 h-64">
                  <Image src={slide.img} alt={slide.title} fill className="object-contain" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex gap-2 md:gap-3 mt-6 md:mt-8">
        {HERO_SLIDES.map((_, index) => (
          <button key={index} onClick={() => setCurrentSlide(index)} className={`h-3 transition-all duration-300 rounded-full ${currentSlide === index ? 'w-8 bg-primary' : 'w-3 bg-blue-300 opacity-50'}`} />
        ))}
      </div>
    </div>
  );
}
