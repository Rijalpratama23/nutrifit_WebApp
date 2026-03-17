import Image from 'next/image';
import ButtonSecond from '@/components/button/secondaryButton/page';

export default function Konsultasi() {
  return (
    <div className="py-20 bg-primary mb-10 px-20" id='konsultasi'>
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

      <div className="flex justify-center items-center bg-white mt-5 mb-10 p-5 rounded-2xl  gap-15">
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
  );
}
