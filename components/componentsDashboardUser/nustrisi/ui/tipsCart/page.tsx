import Image from "next/image";
import { Stethoscope } from "lucide-react";


export default function TipsCart() {
  return (
    <div className="w-full shadow-2xl mt-5 sm:mt-8 md:mt-15 p-3 sm:p-4 md:p-5 rounded-2xl">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-0">
        <div className="w-full md:w-auto">
          <div>
            <div className="flex gap-2 items-center">
              <div className="text-primary bg-blue-200 p-2 rounded-lg">
                <Stethoscope size={20} />
              </div>
              <p className="text-sm sm:text-base">Tips dari Ahli Gizi</p>
            </div>
          </div>
          <div className="md:ml-15 mt-3 sm:mt-4 md:mt-5 space-y-1 sm:space-y-2">
            <li className="text-primary text-sm sm:text-base">Konsumsi di setiap waktu makan</li>
            <li className="text-primary text-sm sm:text-base">Hindari gula berlebih</li>
            <li className="text-primary text-sm sm:text-base">Perbanyak makan sayuran dan serat</li>
          </div>
        </div>
        <div className="flex justify-center md:justify-end mr-0 md:mr-15">
          <Image src="/dokter.png" alt="picture" width={200} height={15} className="w-32 sm:w-40 md:w-auto h-auto" />
        </div>
      </div>
    </div>
  );
}
