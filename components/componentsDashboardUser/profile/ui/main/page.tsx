import { Ruler, Calendar, Weight, Target } from 'lucide-react';
import { UserProfileData } from '../../page';

interface MainProps {
  profileData: UserProfileData;
}

export default function Main({ profileData }: MainProps) {
  // Hitung IMT otomatis
  const imt = profileData.height > 0 && profileData.weight > 0 ? (profileData.weight / Math.pow(profileData.height / 100, 2)).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      {/* Tinggi */}
      <div className="w-full shadow-md sm:shadow-lg p-4 sm:p-5 rounded-lg sm:rounded-xl hover:shadow-xl transition-shadow">
        <div className="bg-blue-300 w-10 sm:w-12 text-primary p-2 rounded-lg sm:rounded-xl inline-flex">
          <Ruler size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <p className="font-bold text-[10px] sm:text-xs tracking-widest text-gray-600 mt-3">TINGGI</p>
        <div className="flex items-center gap-2 mt-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">{profileData.height}</h1>
          <p className="tracking-widest text-[10px] sm:text-xs font-bold">CM</p>
        </div>
      </div>

      {/* Berat */}
      <div className="w-full shadow-md sm:shadow-lg p-4 sm:p-5 rounded-lg sm:rounded-xl hover:shadow-xl transition-shadow">
        <div className="bg-green-300 w-10 sm:w-12 text-secondary p-2 rounded-lg sm:rounded-xl inline-flex">
          <Weight size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <p className="font-bold text-[10px] sm:text-xs tracking-widest text-gray-600 mt-3">BERAT</p>
        <div className="flex items-center gap-2 mt-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">{profileData.weight}</h1>
          <p className="tracking-widest text-[10px] sm:text-xs font-bold">KG</p>
        </div>
      </div>

      {/* Usia */}
      <div className="w-full shadow-md sm:shadow-lg p-4 sm:p-5 rounded-lg sm:rounded-xl hover:shadow-xl transition-shadow">
        <div className="bg-orange-300 w-10 sm:w-12 text-orange-700 p-2 rounded-lg sm:rounded-xl inline-flex">
          <Calendar size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <p className="font-bold text-[10px] sm:text-xs tracking-widest text-gray-600 mt-3">USIA</p>
        <div className="flex items-center gap-2 mt-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">{profileData.age}</h1>
          <p className="tracking-widest text-[10px] sm:text-xs font-bold">TAHUN</p>
        </div>
      </div>

      {/* IMT */}
      <div className="w-full shadow-md sm:shadow-lg p-4 sm:p-5 rounded-lg sm:rounded-xl hover:shadow-xl transition-shadow">
        <div className="bg-purple-300 w-10 sm:w-12 text-purple-700 p-2 rounded-lg sm:rounded-xl inline-flex">
          <Target size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <p className="font-bold text-[10px] sm:text-xs tracking-widest text-gray-600 mt-3">IMT</p>
        <div className="flex items-center gap-2 mt-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">{imt}</h1>
          <p className="tracking-widest text-[10px] sm:text-xs font-bold">KG/M²</p>
        </div>
      </div>
    </div>
  );
}
