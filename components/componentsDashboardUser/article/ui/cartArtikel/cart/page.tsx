import Image from 'next/image';
import Link from 'next/link';

interface CartProps {
  gambar: string;
  tanggalPublish: string;
  deskripsi: string;
}

export default function Cart({ gambar, tanggalPublish, deskripsi }: CartProps) {
  return (
    <div className="p-3 md:p-4 lg:p-5 max-w-xs md:max-w-sm lg:max-w-md mx-auto md:mx-0 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="overflow-hidden rounded-md mb-3 md:mb-4">
        <Image src={gambar} alt="picture" width={280} height={160} className="w-full h-40 md:h-48 object-cover" />
      </div>
      <p className="text-xs md:text-sm py-2 md:py-3 font-light text-subtext">Dipublis {tanggalPublish}</p>
      <h3 className="font-semibold text-sm md:text-base line-clamp-2 text-text mb-3 md:mb-4">{deskripsi}</h3>
      <div className="mt-2">
        <Link href="/">
          <button className="text-secondary hover:text-primary font-medium text-sm md:text-base cursor-pointer transition-all hover:underline">Lihat Semua</button>
        </Link>
      </div>
    </div>
  );
}
