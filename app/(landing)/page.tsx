import Image from 'next/image';
import Navbar from '@/components/navbar/page';
import ButtonXl from '@/components/button/buttonXl/page';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className=" mt-15 mx-3 md:mx-15 ">
        {/* hero section */}
        <div className="hero md:flex justify-between items-center md:gap-15">
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

        {/* koncul section */}
        <div>
          <div>
            <h2>Pilih Jenis Konsultasi</h2>
            <p>Sesuaikan toopik konsultasi dengan kebutuhan dan tujuan anda</p>
          </div>

          <div className='flex justify-center items-center gap-15'>
           
            <div className='card'>
              <h1>ini card</h1>
            </div>
             <div className='card'>
              <h1>ini card</h1>
            </div>
             <div className='card'>
              <h1>ini card</h1>
            </div>
             <div className='card'>
              <h1>ini card</h1>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
