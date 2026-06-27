// components/dashboard/HeroCarousel.js
'use client';

import Image from 'next/image';
import ButtonDashboard from '@/components/button/buttonDashboard/page';
import { HERO_SLIDES } from '@/lib/libUser/constant.js/carrouselHome';
import { useCarousel } from '@/lib/libUser/carrousel/useCarrousel';

export default function HeroCarousel() {
  const { currentSlide, setCurrentSlide } = useCarousel(HERO_SLIDES.length);

  return (
    <div className="flex flex-col items-center justify-center pt-4 sm:pt-8 md:pt-12 lg:pt-20 pb-4 sm:pb-6 md:pb-8 lg:pb-10 px-3 sm:px-4">
      <div className="relative w-full max-w-5xl overflow-hidden">
        {/* Carousel slides */}
        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {HERO_SLIDES.map((slide) => (
            <div key={slide.id} className="min-w-full px-2 sm:px-3 md:px-4">
              <div className="bg-white border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-12 rounded-2xl sm:rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
                {/* Text Content */}
                <div className="content text-center sm:text-left w-full lg:w-auto lg:max-w-md">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 leading-tight">{slide.title}</h1>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6 md:mb-8 leading-relaxed">{slide.desc}</p>
                  <div className="flex justify-center sm:justify-start">
                    <ButtonDashboard text={slide.buttonText} background="bg-primary" destination={slide.buttonDestination} />
                  </div>
                </div>

                {/* Image */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 flex-shrink-0">
                  <Image
                    src={slide.img}
                    alt={slide.title}
                    fill
                    priority={currentSlide === HERO_SLIDES.indexOf(slide)}
                    className="object-contain"
                    sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex gap-1.5 sm:gap-2 md:gap-3 mt-4 sm:mt-6 md:mt-8">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 sm:h-2.5 md:h-3 transition-all duration-300 rounded-full ${currentSlide === index ? 'w-6 sm:w-7 md:w-8 bg-primary' : 'w-2 sm:w-2.5 md:w-3 bg-blue-300 opacity-50 hover:opacity-75'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
