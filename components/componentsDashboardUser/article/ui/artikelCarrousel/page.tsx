// components/artikel/ArtikelBanner.tsx
import Image from 'next/image';
import { ARTIKEL_BANNERS } from '@/lib/libUser/artikelConstant/carrouselArtikel';
import { useCarousel } from '@/lib/libUser/carrouselArtikel/carrouselArtikel';

export default function ArtikelCarrousel() {
  const { currentIndex, setCurrentIndex } = useCarousel(ARTIKEL_BANNERS.length);

  return (
    <div className="mt-25 relative w-full overflow-hidden rounded-2xl shadow-sm bg-gray-100">
      <div 
        className="flex transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {ARTIKEL_BANNERS.map((src, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <Image 
              src={src} 
              alt={`Banner ${index}`} 
              className="w-full h-auto object-cover aspect-[1285/393]" 
              width={1285} 
              height={393} 
              priority={index === 0} // Optimasi loading gambar pertama
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {ARTIKEL_BANNERS.map((_, index) => (
          <button 
            key={index} 
            onClick={() => setCurrentIndex(index)} 
            className={`h-2.5 rounded-full transition-all ${
              currentIndex === index ? 'bg-blue-600 w-5' : 'bg-white/50 hover:bg-white w-2.5'
            }`} 
          />
        ))}
      </div>
    </div>
  );
}