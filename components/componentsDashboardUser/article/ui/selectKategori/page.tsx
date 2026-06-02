'use client';

import Header from '@/components/componentsDashboardUser/konsultasiUser/ui/header/page';
import { BookMarked } from 'lucide-react';

const KATEGORI = ['Semua', 'Gaya Hidup Sehat', 'Diet & Nutrisi', 'Kesehatan Fisik'];

interface Props {
  aktif: string;
  onChange: (kategori: string) => void;
}

export default function SelectArtikel({ aktif, onChange }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center md:mt-15 md:ml-15 mt-8 px-4 md:px-0 gap-6 md:gap-0">
      <Header
        icon={<BookMarked size={40} className="sm:w-12 sm:h-12" />}
        title="Artikel & Edukasi"
        subTitle="Pilih artikel sesuai yang anda suka"
      />

      {/* Filter kategori */}
      <div className="flex flex-wrap gap-3 md:gap-5 justify-center md:justify-end md:mr-15">
        {KATEGORI.map((kat) => (
          <button
            key={kat}
            onClick={() => onChange(kat)}
            className={`py-1 px-3 rounded-2xl border text-sm transition-all cursor-pointer ${
              aktif === kat
                ? 'bg-primary text-white border-primary'
                : 'border-blue-400 text-blue-600 hover:bg-primary hover:bg-blue-200 hover:text-white'
            }`}
          >
            {kat}
          </button>
        ))}
      </div>
    </div>
  );
}