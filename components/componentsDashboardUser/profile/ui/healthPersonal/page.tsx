import { Heart, PencilLine, Timer, Activity, Target } from "lucide-react";



export default function PersonalHealth() {
  return (
    <>
      <div className="mt-4 sm:mt-6 md:mt-3 w-full p-3 sm:p-4 md:p-2 lg:p-1">
        <div className="rounded-lg sm:rounded-2xl lg:rounded-3xl border border-gray-200 shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow">
          {/* Header Section */}
          <div className="flex justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-green-500 flex-shrink-0">
                <Heart size={24} strokeWidth={2.5} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>
              <h2 className="font-bold text-gray-800 text-base sm:text-lg md:text-xl tracking-wide truncate">KESEHATAN PERSONAL</h2>
            </div>
            <button className="text-gray-800 hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg sm:rounded-full transition-colors flex-shrink-0">
              <PencilLine size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-start lg:items-center">
            {/* BMI Info */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4  rounded-lg hover:bg-blue-100 transition-colors">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-blue-100 rounded-lg sm:rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                <Timer size={28} className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-bold text-purple-400 uppercase tracking-widest leading-none mb-1">BMI</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900">0</span>
                  <span className=" text-green-600 text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full uppercase tracking-wider">Underweight</span>
                </div>
              </div>
            </div>

            {/* Aktivitas Info */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-green-100 transition-colors">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-green-100 rounded-lg sm:rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0">
                <Activity size={28} className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-bold text-purple-400 uppercase tracking-widest leading-none mb-1">Aktivitas</p>
                <p className="text-gray-900 font-bold text-base sm:text-lg truncate">Sedang</p>
              </div>
            </div>

            {/* Tujuan Utama Info */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-red-100 transition-colors sm:col-span-2 lg:col-span-1">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-red-100 rounded-lg sm:rounded-2xl flex items-center justify-center text-red-400 flex-shrink-0">
                <Target size={28} className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-bold text-purple-400 uppercase tracking-widest leading-none mb-1">Tujuan Utama</p>
                <p className="text-gray-900 font-bold text-base sm:text-lg truncate">Menaikan berat badan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
