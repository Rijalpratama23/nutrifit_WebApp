'use client';

import { useState } from 'react';
import SelectArtikel from './ui/selectKategori/page';
import CartArtikel from './ui/cartArtikel/page';
import ArtikelCarrousel from './ui/artikelCarrousel/page';

export default function PageArtikel() {
  const [kategoriAktif, setKategoriAktif] = useState('Semua');

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <ArtikelCarrousel />

      <div className="mt-8">
        <SelectArtikel
          aktif={kategoriAktif}
          onChange={setKategoriAktif}
        />
      </div>

      <div className="mt-10 md:mt-15 min-h-screen">
        <CartArtikel kategori={kategoriAktif} />
      </div>
    </div>
  );
}