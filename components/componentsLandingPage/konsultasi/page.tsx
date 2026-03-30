import Image from 'next/image';
import ButtonSecond from '@/components/button/secondaryButton/page';

export default function Konsultasi() {
  return (
    <div id="konsultasi" className="py-12 md:py-20 bg-primary mb-10 px-4 sm:px-6 md:px-20">
      <div className="text-white pt-4 mb-6 md:mb-8">
        <h2 className="font-semibold text-2xl md:text-3xl">Pilih Jenis Konsultasi</h2>
        <p className="font-light text-sm md:text-base">Sesuaikan toopik konsultasi dengan kebutuhan dan tujuan anda</p>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap justify-center items-stretch gap-6 md:gap-10">
        <div className="w-full sm:w-72 md:w-60 card bg-white p-5 rounded-xl">
          <div className="flex items-center pb-3 gap-4">
            <div className="flex-shrink-0">
              <Image src="/landingpage/diet.png" alt="picure" width={55} height={55} className="object-contain" />
            </div>
            <h3 className="font-semibold text-xl">Nutrisi</h3>
          </div>
          <h4 className="mb-3 font-semibold">
            Konsultasi <span className="text-primary">Nutrisi</span>
          </h4>
          <p className="mb-4 text-sm md:text-base">Diskusikan pola makan, kebutuhan gizi dan suplemen sehat</p>

          <div className="mt-2">
            <ButtonSecond text="Pilih Konsultasi" background="bg-secondary" />
          </div>
        </div>

        <div className="w-full sm:w-72 md:w-60 card bg-white p-5 rounded-xl">
          <div className="flex items-center pb-3 gap-4">
            <div className="flex-shrink-0">
              <Image src="/landingpage/nutritions.png" alt="picure" width={55} height={55} className="object-contain" />
            </div>
            <h3 className="font-semibold text-xl">Diet</h3>
          </div>
          <h4 className="mb-3 font-semibold">
            Konsultasi <span className="text-primary">Nutrisi</span>
          </h4>
          <p className="mb-4 text-sm md:text-base">Diskusikan pola makan, kebutuhan gizi dan suplemen sehat</p>

          <div className="mt-2">
            <ButtonSecond text="Pilih Konsultasi" background="bg-secondary" />
          </div>
        </div>

        <div className="w-full sm:w-72 md:w-60 card bg-white p-5 rounded-xl">
          <div className="flex items-center pb-3 gap-4">
            <div className="flex-shrink-0">
              <Image src="/landingpage/lifestyle.png" alt="picure" width={55} height={55} className="object-contain" />
            </div>
            <h3 className="font-semibold text-xl">Lifestyle</h3>
          </div>
          <h4 className="mb-2 font-semibold">
            Konsultasi <span className="text-primary">Nutrisi</span>
          </h4>
          <p className="mb-4 text-sm md:text-base">Diskusikan pola makan, kebutuhan gizi dan suplemen sehat</p>

          <div className="mt-2">
            <ButtonSecond text="Pilih Konsultasi" background="bg-secondary" />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white mt-5 mb-10 p-4 sm:p-6 rounded-2xl">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
            <div className="w-full md:w-1/2 flex justify-center">
              <Image src="/landingpage/doctor.png" alt="picture" width={300} height={180} className="object-contain" />
            </div>

            <div className="w-full md:w-1/2 mt-3 md:mt-0">
              <p className="text-lg md:text-xl mb-4">
                Atur jadwal Konsultasi anda dengan <br className="hidden md:block" /> waktu yang fleksibel dan senyaman <br className="hidden md:block" /> mungkin
              </p>
              <div className="flex justify-start md:justify-start">
                <ButtonSecond text="Pilih Konsultasi" background="bg-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
