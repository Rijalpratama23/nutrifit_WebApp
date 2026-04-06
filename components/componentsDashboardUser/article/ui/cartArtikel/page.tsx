import Cart from './cart/page';

export default function CartArtikel() {
  return (
    <div className="mx-4 md:mx-8 lg:mx-20 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-15 h-180 md:h-200 py-5 md:py-10 overflow-y-auto">
      <Cart gambar="/artikelUser/buahSayur.png" deskripsi="Lebih mengenal sayuran dengan kandungan vitamin dan protein di dalamnya" tanggalPublish="08-03-2026" />
      <Cart gambar="/artikelUser/orang.png" deskripsi="di balik kebiasaan sehari-hari seperti begadang, ngantuk..." tanggalPublish="05-03-2026" />
      <Cart gambar="/artikelUser/buahSayur.png" deskripsi="Lebih mengenal sayuran dengan kandungan vitamin dan protein di dalamnya" tanggalPublish="10-03-2026" />
      <Cart gambar="/artikelUser/buahSayur.png" deskripsi="Lebih mengenal sayuran dengan kandungan vitamin dan protein di dalamnya" tanggalPublish="10-03-2026" />
      <Cart gambar="/artikelUser/buahSayur.png" deskripsi="Lebih mengenal sayuran dengan kandungan vitamin dan protein di dalamnya" tanggalPublish="10-03-2026" />
    </div>
  );
}
