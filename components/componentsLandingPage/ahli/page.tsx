import Image from "next/image";
import { ArrowRight } from 'lucide-react';
import ButtonSecond from "@/components/button/secondaryButton/page";





export default function timAhli() {
  return (
    <div className="py-15" id="tim">
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
  );
}
