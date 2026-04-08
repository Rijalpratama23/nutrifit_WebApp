import Link from 'next/link';
import { User, Settings, Mail, ShieldCheck, LogOut, Ruler, Weight, Calendar, Target, PersonStanding, Vegan, PencilLine, Heart, Timer, Activity } from 'lucide-react';
import Header from '../konsultasiUser/ui/header/page';

export default function ProfilePage() {
  return (
    <div className="w-full min-h-screen bg-white px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 mt-4 sm:mt-8 md:mt-16 lg:mt-20 pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-8 sm:pb-10 md:pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 sm:gap-6">
        <Header icon={<User size={40} className="w-6 sm:w-8 md:w-10 lg:w-10" />} title="Profile" subTitle="Kelola identitas dan tujuan anda" />

        {/* setting button */}
        <button className="cursor-pointer w-auto">
          <div className="flex gap-2 border border-gray-800 rounded-lg md:text-center items-center sm:rounded-xl py-2 sm:py-2.5 px-4 sm:px-5 hover:bg-gray-50 transition-colors">
            <Settings size={18} className="sm:block" />
            <p className="text-sm sm:text-base">Edit Profile</p>
          </div>
        </button>
      </div>

      {/* content */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-6 sm:mt-8 md:mt-10 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-full sm:w-60 lg:w-64 flex-shrink-0 md:mt-20">
          <div className="mt-6 bg-profile-gradient sm:mt-8 md:mt-10 w-full py-6 sm:py-7 px-4 sm:px-5 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl h-auto bg-white">
            <div className="flex justify-center items-center p-3">
              <div className="p-3 rounded-full border w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center text-center">
                <User size={40} className="sm:w-12 sm:h-12" />
              </div>
            </div>
            {/* Profile Info */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-center font-semibold text-base sm:text-lg">namaUser</h2>
              <div className="flex gap-1 items-center justify-center text-xs sm:text-sm">
                <Mail size={14} />
                <p className="tracking-widest truncate">email.@gmail.com</p>
              </div>
              <div className="w-full sm:w-auto flex gap-1 items-center justify-center bg-green-200 text-secondary rounded-lg border border-green-600 py-2 sm:py-3">
                <ShieldCheck size={14} className="sm:w-4 sm:h-4" />
                <p className="text-xs sm:text-sm font-medium">Verified</p>
              </div>
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <p className="tracking-widest text-xs sm:text-sm font-medium">status user</p>
                <ul>
                  <li className="text-secondary text-xs sm:text-sm">online</li>
                </ul>
              </div>
              <Link href="/login" className="flex justify-center items-center gap-2 bg-red-50 border border-red-500 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-red-600 font-semibold text-sm sm:text-base hover:bg-red-100 transition-colors">
                <LogOut size={18} />
                <p>Keluar</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full">
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

          {/* Target Section */}
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

          {/* Health Personal Section */}
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
        </div>
      </div>
    </div>
  );
}
