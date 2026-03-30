import Image from "next/image";
import ButtonXl from '@/components/button/buttonXl/page';

export default function Hero() {
  return (
    <section className="mx-3 md:mx-15" id="hero">
      <div className="py-10 md:py-32 hero md:flex justify-between items-center md:gap-15">
        <div className="flex justify-between p-5">
          <div>
            <h2 className="font-semibold text-4xl mb-8 md:w-130">
              Wujudkan Tubuh Ideal & Gaya Hidup Sehat Bersama <span className="text-gradient">Nutrifit</span>
            </h2>
            <div className="mb-8 md:w-110">
              <p>NutriFit adalah platform digital yang membantu mencapai target berat badan dan pola hidup sehat melalui panduan nutrisi dan konsultasi ahli.</p>
            </div>
            <div>
              <ButtonXl title="Konsultasi Sekarang!" />
            </div>
          </div>
        </div>
        <div>
          <Image src="/hero.png" alt="picture" width={500} height={100} />
        </div>
      </div>
    </section>
  );
}
