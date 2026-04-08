import { Target, PencilLine, PersonStanding, Weight, Vegan } from "lucide-react";

export default function TargetPage() {
  return (
    <>
      <div className="mt-8 sm:mt-10 md:mt-12 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8 bg-white hover:shadow-xl transition-shadow w-full">
        <div className="flex justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 sm:gap-3 items-center">
            <Target size={32} className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-red-600 flex-shrink-0" />
            <h3 className="font-bold text-base sm:text-lg md:text-xl">TARGET</h3>
          </div>
          <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <PencilLine size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-5 sm:mt-6 md:mt-8">
          {/* Target Kebugaran */}
          <div className="flex gap-3 sm:gap-4 items-start sm:items-center p-3 sm:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <PersonStanding size={32} className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 font-bold text-primary flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-semibold text-gray-700 truncate">TARGET KEBUGARAN</h1>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-600 line-clamp-2">Menambah masa otot</p>
            </div>
          </div>
          {/* Target Berat Badan */}
          <div className="flex gap-3 sm:gap-4 items-start sm:items-center p-3 sm:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Weight size={32} className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 font-bold text-secondary flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-semibold text-gray-700 truncate">TARGET BERAT BADAN</h1>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-600 line-clamp-2">Menambah masa otot</p>
            </div>
          </div>
          {/* Konsumsi Makan */}
          <div className="flex gap-3 sm:gap-4 items-start sm:items-center p-3 sm:p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors sm:col-span-2 lg:col-span-1">
            <Vegan size={32} className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 font-bold text-primary flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-semibold text-gray-700 truncate">KONSUMSI MAKAN</h1>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-600 line-clamp-2">Vegetarian</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
