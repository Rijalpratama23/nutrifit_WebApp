import Image from 'next/image';
import ButtonSecond from '@/components/button/secondaryButton/page';

const timAhliList = [
  {
    img: '/landingPage/doctor1.jpg',
    name: 'dr. Mulianah Daya, M.Gizi, Sp.GKz',
    title: 'Dokter Spesialis Gizi',
    desc: 'Cukup aktif dalam tergabung di organisasi Persatuan Dokter Gizi Klinik Indonesia (PDGKI).',
  },
  {
    img: '/landingPage/doctor3.jpg',
    name: 'dr. Diyah Eka Andayani, Sp.GK',
    title: 'Dokter Spesialis Gizi',
    desc: 'dr. Diyah Eka Andayani, Sp.GK merupakan dokter spesialis gizi klinik yang biasa mengatasi masalah pertumbuhan pada anak.',
  },
  {
    img: '/landingPage/doctor2.jpg',
    name: 'dr. Sentot Handoko, Sp.GK',
    title: 'Dokter Spesialis Gizi',
    desc: 'Dokter Handoko juga tergabung dalam Ikatan Dokter Indonesia (IDI) dan Perhimpunan Dokter Spesialis Gizi Klinik Indonesia (PDGKI).',
  },
];

export default function TimAhli() {
  return (
    <div className="py-10 md:py-15 px-6" id="tim">
      <div className="text-center mt-4 md:mt-10 mb-8 md:mb-14">
        <h1 className="font-semibold text-3xl md:text-4xl text-primary">Kenali Tim Ahli</h1>
        <p className="text-primary font-light text-sm md:text-base px-4">Sesuaikan tim ahli dengan yang anda butuhkan!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
        {timAhliList.map((ahli) => (
          <div key={ahli.name} className="flex flex-col p-5 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] bg-white hover:scale-105 transition-transform duration-300">
            <div className="relative w-full aspect-[4/3] md:h-[180px]">
              <Image src={ahli.img} alt={ahli.name} fill className="rounded-2xl object-cover" />
            </div>
            <h4 className="text-center pt-4 font-bold text-gray-800">{ahli.name}</h4>
            <blockquote className="text-center italic font-light text-sm text-gray-500 pb-2">{ahli.title}</blockquote>
            <p className="text-center leading-5 text-gray-600 text-sm md:text-base px-2 flex-1">{ahli.desc}</p>
            <div className="flex justify-center pt-5">
              <ButtonSecond text="Lihat Profile" background="bg-primary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
