import Image from 'next/image';
import ButtonDashboard from '@/components/button/buttonDashboard/page';

export default function ProgramSec() {
  return (
    <section className="program bg-white py-6 sm:py-8 md:py-10 lg:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          {/* Heading */}
          <h1 className="text-center font-semibold text-primary text-xl sm:text-2xl md:text-3xl lg:text-4xl px-2">Program Anda</h1>

          {/* Main Card */}
          <div className="flex flex-col lg:flex-row mt-4 sm:mt-6 md:mt-8 lg:mt-10 justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 pt-4 sm:pt-6 md:pt-8 lg:pt-10 p-4 sm:p-5 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-4xl shadow-lg sm:shadow-xl border border-gray-200">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-48 h-32 sm:w-56 sm:h-40 md:w-64 md:h-48 lg:w-72 lg:h-56">
                <Image src="/landingPage/doctor.png" alt="doctor illustration" fill className="object-contain" priority sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 288px" />
              </div>
            </div>

            {/* Text & Button Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              <p className="text-sm sm:text-base md:text-lg lg:text-lg leading-relaxed text-gray-700 mb-4 sm:mb-5 md:mb-6 lg:mb-7">Atur jadwal Konsultasi anda dengan waktu yang fleksibel dan senyaman mungkin</p>
              <div className="w-full sm:w-auto">
                <ButtonDashboard text="Mulai Konsultasi" background="bg-primary" destination="/user/program" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
