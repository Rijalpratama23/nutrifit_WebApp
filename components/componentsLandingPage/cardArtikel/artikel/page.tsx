import ArtikelLanding from './artikelLanding/page';

export default function Artikel() {
  return (
    <div className="py-10 md:py-20 bg-primary" id="artikel">
      <div className="px-6 md:px-20 mb-8">
        <h2 className="font-semibold text-white text-3xl md:text-4xl">Artikel Kesehatan</h2>
        <p className="text-white font-light opacity-90">Pilih Artikel sesuai minat anda</p>
      </div>

      <div className="px-6 md:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <ArtikelLanding Img="/landingPage/diet.png" title="Tips Nutrisi" text="Pilih makanan dan jaga kesehatan. mari jaga kesehatan dimulai dari langkah kecil" />
          <ArtikelLanding Img="/landingPage/polamakan.png" title="Pola Makan" text="Makan dengan bijak hidup akan sehat, karena pola makan mempengaruhi kesehatan tubuh " />
          <ArtikelLanding Img="/landingPage/mitos&fakta.png" title="Mitos & Fakta" text="Bedah mitos yang ada, dan temukan fakta unik seputar kesehatan" />
          <ArtikelLanding Img="/landingPage/burble.png" title="Gaya Hidup" text="Jadikan sehat sebagai gaya hidup bukan tujuan, karena sehat adalah investasi masa depan" />
        </div>
      </div>
    </div>
  );
}
