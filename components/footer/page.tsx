import Image from 'next/image';
import { Youtube, Instagram, Linkedin, Facebook } from 'lucide-react';

type FooterProps = {
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  accentColor?: string; 
  background?: string;
  textColor?: string;
  accentIsClass?: boolean; 
};

export default function Footer({ logoSrc = '/Logo.png', logoAlt = 'NutriFit', logoWidth = 160, logoHeight = 48, accentColor = 'bg-primary', background, textColor , accentIsClass = true }: FooterProps) {
  return (
    <footer className={`w-full ${background} pt-10 pb-8 px-6 md:px-16 lg:px-24 border-t border-gray-100`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <div className="h-12 w-40 relative">
                <Image src={logoSrc} alt={logoAlt} width={logoWidth} height={logoHeight} className="object-contain" />
              </div>
            </div>

            <p className={`${textColor} text-sm md:text-base leading-relaxed max-w-sm`}>Platform edukasi dan konsultasi nutrisi berbasis web untuk mendukung gaya hidup sehat.</p>
            <div className="flex gap-4 mt-2">
              <div className="w-8 h-8 text-white rounded-md bg-pink-500 cursor-pointer flex justify-center items-center">
                <Instagram />
              </div>
              <div className="w-8 h-8 text-white bg-blue-500 rounded-md cursor-pointer flex justify-center items-center">
                <Facebook />
              </div>
              <div className="w-8 h-8 text-white bg-red-600 rounded-md cursor-pointer flex justify-center items-center">
                <Youtube />
              </div>
              <div className="w-8 h-8 rounded-md text-white bg-blue-500 cursor-pointer flex justify-center items-center">
                <Linkedin />
              </div>
            </div>
          </div>

          <div className="md:pl-10">
            <h3 className={`text-lg font-bold ${textColor} mb-5`}>Informasi Project</h3>
            <ul className={`space-y-2 ${textColor} text-sm md:text-base`}>
              <li>Project Akhir Magang</li>
              <li>Universitas Nusa Putra</li>
              <li>Tahun 2026</li>
            </ul>
          </div>

          <div>
            <h3 className={`text-lg font-bold ${textColor} mb-5`}>Kontak</h3>
            <ul className={`space-y-2 ${textColor} text-sm md:text-base`}>
              <li>info@nusaputra.ac.id.</li>
              <li className="border-b border-gray-400 inline-block">rijal_pratama.ti23@nusaputra.ac.id</li>
              <li>@rijalpratama</li>
            </ul>
          </div>
        </div>

        {/* Garis Aksen */}
        <div className={accentIsClass ? `w-full h-[3px] ${accentColor} mb-6` : 'w-full h-[3px] mb-6'} style={!accentIsClass ? { backgroundColor: accentColor } : undefined} />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`${textColor} text-sm`}>© 2026 NutriFit – Project Magang. Untuk tujuan edukasi.</p>

          <nav className="flex gap-6 md:gap-10">
            <span className={`font-bold ${textColor} cursor-pointer`}>Beranda</span>
            <span className={`font-bold ${textColor} cursor-pointer`}>Konsultasi</span>
            <span className={`font-bold ${textColor} cursor-pointer`}>Tim Ahli</span>
            <span className={`font-bold ${textColor} cursor-pointer`}>Artikel</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
