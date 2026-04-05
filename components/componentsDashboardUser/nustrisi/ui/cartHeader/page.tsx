import { Flame } from "lucide-react";


export default function CartHead() {
  return (
    <div className="w-full shadow-2xl mt-5 p-3 sm:p-4 md:p-5 rounded-2xl">
      <div>
        <div className="flex gap-2 items-center">
          <div className="flame text-orange-500 bg-orange-200 p-2 rounded-sm">
            <Flame size={20} />
          </div>
          <h3 className="text-sm sm:text-base md:text-lg">Ringkasan Nutrisi (Rencana) </h3>
        </div>
      </div>

      {/* card info kallories */}
      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mr-1 sm:mr-3">
        <div className="bg-orange-200 w-full sm:w-1/2 lg:w-60 mt-4 sm:mt-5 md:mt-7 p-3 rounded-xl">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-orange-500 tracking-widest">Kalori</h4>
            <div className="flex gap-2 items-center pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-widest">3300</h1>
              <p className="text-xs sm:text-sm pt-2 tracking-widest font-bold text-gray-100">KCAL</p>
            </div>
            <hr className="border-t-3 border-orange-400" />
          </div>
        </div>

        <div className="bg-blue-200 w-full sm:w-1/2 lg:w-60 mt-4 sm:mt-5 md:mt-7 p-3 rounded-xl">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-blue-500 tracking-widest">Protein</h4>
            <div className="flex gap-2 items-center pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-widest">180</h1>
              <p className="text-xs sm:text-sm pt-2 tracking-widest font-bold text-gray-100">G</p>
            </div>
            <hr className="border-t-3 border-blue-400" />
          </div>
        </div>

        <div className="bg-green-200 w-full sm:w-1/2 lg:w-60 mt-4 sm:mt-5 md:mt-7 p-3 rounded-xl">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-green-500 tracking-widest">Karbo</h4>
            <div className="flex gap-2 items-center pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-widest">390</h1>
              <p className="text-xs sm:text-sm pt-2 tracking-widest font-bold text-gray-100">G</p>
            </div>
            <hr className="border-t-3 border-green-400" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 w-full sm:w-1/2 lg:w-60 mt-4 sm:mt-5 md:mt-7 p-3 rounded-xl">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-orange-500 tracking-widest">Lemak</h4>
            <div className="flex gap-2 items-center pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-widest">121</h1>
              <p className="text-xs sm:text-sm pt-2 tracking-widest font-bold text-gray-300">G</p>
            </div>
            <hr className="border-t-3 border-orange-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
