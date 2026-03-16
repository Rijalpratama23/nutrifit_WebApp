import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/navbar/page';
import ButtonXl from '@/components/button/buttonXl/page';
import ButtonSecond from '@/components/button/secondaryButton/page';
import ArtikelLanding from '@/components/cardArtikel/artikelLanding/page';

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      <Navbar />
      <main className="mx-3 md:mx-15 ">
        {/* hero section */}
        <div className="min-h-screen hero md:flex justify-between items-center md:gap-15">
          <div className="flex justify-between p-5">
            <div>
              <h2 className="font-semibold text-4xl mb-8 md:w-130">
                Wujudkan Tubuh Ideal & Gaya Hidup Sehat Bersama <span className="text-gradient">Nutrifit</span>
              </h2>
              <div className="mb-8 md:w-110">
                <p>NutriFit adalah platform digital yang membantu mencapai target berat badan dan pola hidup sehat melalui panduan nutrisi dan konsultasi ahli.</p>
              </div>
              <div>
                <ButtonXl />
              </div>
            </div>
          </div>
          <div>
            <Image src="/hero.png" alt="picture" width={500} height={100} />
          </div>
        </div>
      </main>

      {/* koncul section */}
      <div className="min-h-screen bg-primary px-20">
        <div className="text-white pt-4 mb-8">
          <h2 className="font-semibold text-3xl text-">Pilih Jenis Konsultasi</h2>
          <p className="font-light">Sesuaikan toopik konsultasi dengan kebutuhan dan tujuan anda</p>
        </div>

        <div className="flex justify-center items-center gap-20">
          <div className="w-60 card bg-white p-5 rounded-xl">
            <div className="flex items-center pb-3 gap-5">
              <Image src="/landingpage/diet.png" alt="picure" width={55} height={15} />
              <h3 className="font-semibold text-xl ">Nutrisi</h3>
            </div>
            <h4 className="mb-3 font-semibold">
              Konsultasi <span className="text-primary">Nutrisi</span>
            </h4>
            <p className="mb-3">Diskusikan pola makan, kebutuhan gizi dan suplemen sehat</p>

            <ButtonSecond text="Pilih Konsultasi" background="bg-secondary" />
          </div>

          <div className="w-60 card bg-white p-5 rounded-xl">
            <div className="flex items-center pb-3 gap-5">
              <Image src="/landingpage/nutritions.png" alt="picure" width={53} height={15} />
              <h3 className="font-semibold text-xl ">Diet</h3>
            </div>
            <h4 className="mb-3 font-semibold">
              Konsultasi <span className="text-primary">Nutrisi</span>
            </h4>
            <p className="mb-3">Diskusikan pola makan, kebutuhan gizi dan suplemen sehat</p>

            <ButtonSecond text="Pilih Konsultasi" background="bg-secondary" />
          </div>

          <div className="w-60 card bg-white p-5 rounded-xl">
            <div className="flex items-center pb-3 gap-5">
              <Image src="/landingpage/lifestyle.png" alt="picure" width={55} height={15} />
              <h3 className="font-semibold text-xl">Lifestyle</h3>
            </div>
            <h4 className="mb-2 font-semibold">
              Konsultasi <span className="text-primary">Nutrisi</span>
            </h4>
            <p className="mb-3">Diskusikan pola makan, kebutuhan gizi dan suplemen sehat</p>

            <ButtonSecond text="Pilih Konsultasi" background="bg-secondary" />
          </div>
        </div>

        <div className="flex justify-center items-center bg-white mt-5 p-5 rounded-2xl gap-15">
          {/* card atur jadwal */}
          <div className="w-full flex justify-around p-3">
            <Image src="/landingpage/doctor.png" alt="picture" width={300} height={15} />
            <div className="w-100 mt-7 ">
              <p className="text-xl mb-5">
                Atur jadwal Konsultasi anda dengan <br /> waktu yang fleksibel dan senyaman <br /> mungkin
              </p>
              <ButtonSecond text="Pilih Konsultasi" background="bg-secondary" />
            </div>
          </div>
        </div>
      </div>

      {/* timahli section */}
      <div className="min-h-130">
        <div className="text-center mt-4 md:mt-10 mb-5 md:mb-10">
          <h1 className="font-semibold text-3xl text-primary">Kenali Tim Ahli</h1>
          <p className="text-primary font-light">sesuaikan tim ahli dengan ynag anda butuhkan!</p>
        </div>

        <div className="md:flex justify-center md:gap-15">
          <div className="w-30 md:w-60 flex cart items-center p-5 rounded-xl shadow-2xl">
            <div className="items-center">
              <Image src="/landingpage/doctor.jpg" alt="picture" width={250} height={59} className="rounded-xl" />
              <h4 className="text-center pt-2 font-semibold">Dr.Adika Pratama, S.Gz</h4>
              <blockquote className="text-center italic font-light text-sm pb-1 md:pb-3">Doctor Spesialis Gizi</blockquote>
              <p className="md:mb-3 text-center border-spacing-3.5 leading-4">Doctor dengan pengalaman yang mumuni dan ahli di bidangnya.</p>

              <div className="flex justify-center ">
                <ButtonSecond text="Lihat Profile" background="bg-primary" />
              </div>
            </div>
          </div>

          <div className="w-30 md:w-60 flex cart items-center p-5 rounded-xl shadow-2xl">
            <div className="items-center">
              <Image src="/landingpage/doctor.jpg" alt="picture" width={250} height={59} className="rounded-xl" />
              <h4 className="text-center pt-2 font-semibold">Dr.Adika Pratama, S.Gz</h4>
              <blockquote className="text-center italic font-light text-sm pb-1 md:pb-3">Doctor Spesialis Gizi</blockquote>
              <p className="md:mb-3 text-center border-spacing-3.5 leading-4">Doctor dengan pengalaman yang mumuni dan ahli di bidangnya.</p>

              <div className="flex justify-center ">
                <ButtonSecond text="Lihat Profile" background="bg-primary" />
              </div>
            </div>
          </div>

          <div className="w-30 md:w-60 flex cart items-center p-5 rounded-xl shadow-2xl">
            <div className="items-center">
              <Image src="/landingpage/doctor.jpg" alt="picture" width={250} height={59} className="rounded-xl" />
              <h4 className="text-center pt-2 font-semibold">Dr.Adika Pratama, S.Gz</h4>
              <blockquote className="text-center italic font-light text-sm pb-1 md:pb-3">Doctor Spesialis Gizi</blockquote>
              <p className="md:mb-3 text-center border-spacing-3.5 leading-4">Doctor dengan pengalaman yang mumpuni dan ahli di bidangnya.</p>

              <div className="flex justify-center ">
                <ButtonSecond text="Lihat Profile" background="bg-primary" />
              </div>
            </div>
          </div>
        </div>
        <div className="md:flex justify-end items-center gap-5 mr-45 mt-5">
          <p>View All</p>
          <h1 className="justify-end bg-primary p-1 rounded-3xl text-white">
            <ArrowRight />
          </h1>
        </div>
      </div>

      {/* artikel */}
      <div className="min-h-130 bg-primary">
        <div className="pl-20">
          <h2 className="font-semibold text-white text-3xl pt-10">Artikel Kesehatan</h2>
          <p className="text-white font-light">Pilih Artikel sesuai minat anda</p>
        </div>
        <div className="mx-20 flex justify-center">
          <div className="pt-4 md:pt-8 flex justify-center flex-wrap">
            <ArtikelLanding Img="/landingPage/diet.png" title="Tips Nutrisi" text="Menjaga pola makan sehat dapat di mulai dengan langkah sederhana" />
            <ArtikelLanding Img="/landingPage/polamakan.png" title="Pola Makan" text="Menjaga pola makan sehat dapat di mulai dengan langkah sederhana" />
            <ArtikelLanding Img="/landingPage/mitos&fakta.png" title="Mitos & Fakta" text="Menjaga pola makan sehat dapat di mulai dengan langkah sederhana" />
            <ArtikelLanding Img="/landingPage/burble.png" title="Gaya Hidup" text="Menjaga pola makan sehat dapat di mulai dengan langkah sederhana" />
          </div>
        </div>
      </div>

      {/* footer */}
      
    </div>
  );
}
