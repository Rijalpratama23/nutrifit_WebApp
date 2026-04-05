import Image from "next/image";
import { Utensils } from "lucide-react";


export default function CartMeal() {
  return (
    <div className="w-full shadow-2xl mt-5 sm:mt-8 md:mt-15 p-3 sm:p-4 md:p-5 rounded-2xl ">
      <div>
        <div className="flex gap-2 items-center">
          <div className="bg-green-200 p-2 rounded-sm text-green-600">
            <Utensils size={20} />
          </div>
          <h3 className="text-sm sm:text-base md:text-lg">Contoh Meal Plan</h3>
        </div>

        <div className="flex gap-2 sm:gap-3 md:gap-20 md:justify-center flex-wrap">
          {/* card */}
          <div className="mt-4 sm:mt-5 w-full sm:w-1/2 lg:w-auto rounded-xl bg-white shadow">
            <p className="bg-orange-400 p-2 text-center rounded-t-xl text-xs sm:text-sm">Breakfast</p>
            <Image src="/makanan.png" alt="picture" width={205} height={20} className="w-full h-auto" />
            <p className="font-semibold p-3 text-center text-xs sm:text-sm">Oatmeal + Telor rebus</p>
          </div>

          <div className="mt-4 sm:mt-5 w-full sm:w-1/2 lg:w-auto rounded-xl bg-white shadow">
            <p className="bg-blue-400 p-2 text-center rounded-t-xl text-xs sm:text-sm">Lunch</p>
            <Image src="/makanan.png" alt="picture" width={205} height={20} className="w-full h-auto" />
            <p className="font-semibold p-3 text-center text-xs sm:text-sm">Oatmeal + Telor rebus</p>
          </div>

          <div className="mt-4 sm:mt-5 w-full sm:w-1/2 lg:w-auto rounded-xl bg-white shadow">
            <p className="bg-green-400 p-2 text-center rounded-t-xl text-xs sm:text-sm">Dinner</p>
            <Image src="/makanan.png" alt="picture" width={205} height={20} className="w-full h-auto" />
            <p className="font-semibold p-3 text-center text-xs sm:text-sm">Oatmeal + Telor rebus</p>
          </div>

          <div className="mt-4 sm:mt-5 w-full sm:w-1/2 lg:w-auto rounded-xl bg-white shadow">
            <p className="bg-yellow-400 p-2 text-center rounded-t-xl text-xs sm:text-sm">Snack</p>
            <Image src="/makanan.png" alt="picture" width={205} height={20} className="w-full h-auto" />
            <p className="font-semibold p-3 text-center text-xs sm:text-sm">Oatmeal + Telor rebus</p>
          </div>
        </div>
      </div>
    </div>
  );
}
