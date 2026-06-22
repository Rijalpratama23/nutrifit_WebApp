import Image from 'next/image';
import ButtonSecond from '@/components/button/secondaryButton/page';

const konsultasiList = [
  {
    img: '/landingPage/diet.png',
    title: 'Nutrisi',
    desc: 'Diskusikan pola makan, kebutuhan gizi dan suplemen sehat',
  },
  {
    img: '/landingPage/nutritions.png',
    title: 'Diet',
    desc: 'Diskusikan pola makan, kebutuhan gizi dan asupan kalori dengan ahli',
  },
  {
    img: '/landingPage/lifestyle.png',
    title: 'Lifestyle',
    desc: 'Gaya hidup mempengaruhi bagaimana hidup anda kedepannya, diskusikan pola hidup sehat dengan ahli',
  },
];

export default function Konsultasi() {
  return (
    <div id="konsultasi" className="py-12 md:py-20 bg-primary mb-10 px-4 sm:px-6 md:px-20">
      <div className="text-white pt-4 mb-6 md:mb-8">
        <h2 className="font-semibold text-2xl md:text-3xl">Pilih Jenis Konsultasi</h2>
        <p className="font-light text-sm md:text-base">Sesuaikan topik konsultasi dengan kebutuhan dan tujuan anda</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {konsultasiList.map((item) => (
          <div key={item.title} className="bg-white p-5 rounded-xl flex flex-col">
            <div className="flex items-center gap-4 pb-3">
              <Image src={item.img} alt={item.title} width={55} height={55} className="object-contain flex-shrink-0" />
              <h3 className="font-semibold text-xl">{item.title}</h3>
            </div>
            <h4 className="mb-3 font-semibold">
              Konsultasi <span className="text-primary">{item.title}</span>
            </h4>
            <p className="text-sm md:text-base flex-1">{item.desc}</p>
            <div className="mt-4">
              <ButtonSecond text="Pilih Konsultasi" background="bg-secondary" />
            </div>
          </div>
        ))}
      </div>

      {/* Banner bawah */}
      <div className="mt-8">
        <div className="bg-white p-5 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2 flex justify-center">
            <Image src="/landingPage/doctor.png" alt="doctor" width={300} height={180} className="object-contain" />
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-lg md:text-xl font-medium mb-5 leading-relaxed">Atur jadwal konsultasi anda dengan waktu yang fleksibel dan senyaman mungkin</p>
            <ButtonSecond text="Pilih Konsultasi" background="bg-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}
