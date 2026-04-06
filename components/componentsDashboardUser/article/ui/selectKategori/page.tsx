import Link from 'next/link';
import Header from '@/components/componentsDashboardUser/konsultasiUser/ui/header/page';
import { BookMarked } from 'lucide-react';

export default function SelectArtikel() {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center md:mt-15 md:ml-15 mt-8 px-4 md:px-0 gap-6 md:gap-0">
      <Header icon={<BookMarked size={40} className="sm:w-12 sm:h-12" />} title="Artikel & Edukasi" subTitle="Pilih artikel sesuai yang anda suka" />

      {/* select artikel */}
      <div className="flex flex-wrap gap-3 md:gap-5 justify-center md:justify-end md:mr-15">
        <div className="py-1 px-2 rounded-2xl border border-blue-400 text-sm hover-bg-primary hover:text-white  cursor-pointer">
          <Link href="/">
            <p>Semua</p>
          </Link>
        </div>
        <div className="py-1 px-2 rounded-2xl border border-blue-400 text-sm hover-bg-primary hover:text-white  cursor-pointer">
          <Link href="/">
            <p>Nutrisi</p>
          </Link>
        </div>
        <div className="py-1 px-2 rounded-2xl border border-blue-400 text-sm hover-bg-primary hover:text-white  cursor-pointer">
          <Link href="/">
            <p>Pola makan</p>
          </Link>
        </div>
        <div className="py-1 px-2 rounded-2xl border border-blue-400 text-sm hover-bg-primary hover:text-white  cursor-pointer">
          <Link href="/">
            <p>Mitos Fakta</p>
          </Link>
        </div>
        <div className="py-1 px-2 rounded-2xl border border-blue-400 text-sm hover-bg-primary hover:text-white  cursor-pointer">
          <Link href="/">
            <p>Gaya Hidup</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
