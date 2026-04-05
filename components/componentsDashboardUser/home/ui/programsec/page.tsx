import Image from "next/image";
import ButtonXl from "@/components/button/buttonXl/page";

export default function ProgramSec() {
  return (
    <section className="program p-6 md:p-10">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl px-4">
          <h1 className="text-center font-semibold text-primary text-2xl md:text-3xl">Program Anda</h1>
          <div className="flex flex-col md:flex-row mt-5 md:mt-8 justify-center items-center gap-6 md:gap-10 pt-6 md:pt-10 p-4 md:p-5 rounded-2xl md:rounded-4xl shadow-2xl border border-gray-200">
            <div className="w-full md:w-1/2 flex justify-center">
              <Image src="/landingPage/doctor.png" alt="picture" width={260} height={160} className="object-contain" />
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-base md:text-lg mb-4 md:mb-5">
                Atur jadwal Konsultasi anda dengan <br className="hidden md:block" /> waktu yang fleksibel dan senyaman <br className="hidden md:block" /> mungkin
              </p>
              <ButtonXl title="Mulai Konsultasi" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
