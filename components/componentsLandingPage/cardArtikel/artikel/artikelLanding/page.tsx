import Image from 'next/image';
import ButtonSecond from '@/components/button/secondaryButton/page';

type artikelLandingProps = {
  Img: string;
  title: string;
  text: string;
};

export default function ArtikelLanding({ Img, title, text }: artikelLandingProps) {
  return (
    <div className="w-full flex flex-row items-start p-4 md:p-6 gap-4 md:gap-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300">
      <div className="flex-shrink-0">
        <Image src={Img} alt={title} width={80} height={80} className="md:w-[100px] md:h-[100px] object-contain" />
      </div>

      {/* Content Container */}
      <div className="text-white flex flex-col justify-center">
        <h1 className="font-bold text-lg md:text-xl pb-1 md:pb-2 leading-tight">{title}</h1>
        <p className="text-xs md:text-sm font-light opacity-80 mb-4 line-clamp-2 md:line-clamp-none">{text}</p>
        <div className="w-fit">
          <ButtonSecond text="Lihat Artikel" background="bg-secondary" />
        </div>
      </div>
    </div>
  );
}
