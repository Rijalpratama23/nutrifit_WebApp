import { MessageSquareDot } from "lucide-react";


export default function HeaderKonsul() {
  return (
    <div className="flex sm:flex-row gap-4 sm:gap-5 items-start sm:items-center mb-6 sm:mb-8 mt-15 md:mt-10">
      <div className="text-primary font-bold flex-shrink-0">
        <MessageSquareDot size={40} className="sm:w-12 sm:h-12" />
      </div>
      <div className="text-primary">
        <h2 className="font-semibold text-2xl sm:text-3xl md:text-4xl">Konsultasi Saya</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Konsultasikan Masalah anda dengan ahli</p>
      </div>
    </div>
  );
}
