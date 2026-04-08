import { Ruler, Calendar, Weight, Target } from "lucide-react";



export default function Main() {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {/* Card Tinggi */}
        <div className="w-full shadow-md sm:shadow-lg p-4 sm:p-5 rounded-lg sm:rounded-xl hover:shadow-xl transition-shadow">
          <div className="cart">
            <div className="bg-blue-300 w-10 sm:w-12 text-primary p-2 rounded-lg sm:rounded-xl inline-flex">
              <Ruler size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="font-bold text-[10px] sm:text-xs tracking-widest text-gray-600 mt-3">TINGGI</p>
            <div className="flex items-center gap-2 mt-2">
              <h1 className="text-2xl sm:text-3xl font-semibold">0</h1>
              <p className="tracking-widest text-[10px] sm:text-xs font-bold">CM</p>
            </div>
          </div>
        </div>

        {/* Card Berat */}
        <div className="w-full shadow-md sm:shadow-lg p-4 sm:p-5 rounded-lg sm:rounded-xl hover:shadow-xl transition-shadow">
          <div className="cart">
            <div className="bg-green-300 w-10 sm:w-12 text-secondary p-2 rounded-lg sm:rounded-xl inline-flex">
              <Weight size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="font-bold text-[10px] sm:text-xs tracking-widest text-gray-600 mt-3">BERAT</p>
            <div className="flex items-center gap-2 mt-2">
              <h1 className="text-2xl sm:text-3xl font-semibold">0</h1>
              <p className="tracking-widest text-[10px] sm:text-xs font-bold">KG</p>
            </div>
          </div>
        </div>

        {/* Card Usia */}
        <div className="w-full shadow-md sm:shadow-lg p-4 sm:p-5 rounded-lg sm:rounded-xl hover:shadow-xl transition-shadow">
          <div className="cart">
            <div className="bg-orange-300 w-10 sm:w-12 text-orange-700 p-2 rounded-lg sm:rounded-xl inline-flex">
              <Calendar size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="font-bold text-[10px] sm:text-xs tracking-widest text-gray-600 mt-3">USIA</p>
            <div className="flex items-center gap-2 mt-2">
              <h1 className="text-2xl sm:text-3xl font-semibold">0</h1>
              <p className="tracking-widest text-[10px] sm:text-xs font-bold">TAHUN</p>
            </div>
          </div>
        </div>

        {/* Card IMT */}
        <div className="w-full shadow-md sm:shadow-lg p-4 sm:p-5 rounded-lg sm:rounded-xl hover:shadow-xl transition-shadow">
          <div className="cart">
            <div className="bg-purple-300 w-10 sm:w-12 text-purple-700 p-2 rounded-lg sm:rounded-xl inline-flex">
              <Target size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="font-bold text-[10px] sm:text-xs tracking-widest text-gray-600 mt-3">IMT</p>
            <div className="flex items-center gap-2 mt-2">
              <h1 className="text-2xl sm:text-3xl font-semibold">0</h1>
              <p className="tracking-widest text-[10px] sm:text-xs font-bold">KG/M²</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
