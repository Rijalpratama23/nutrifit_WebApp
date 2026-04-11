import { Bell, User } from "lucide-react";

export default function HeaderKomponents() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Selamat Datang Doctor @ahli</h1>
        <p className="text-slate-500 text-sm">Pemberitahuan dan informasi menyeluruh</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative p-2.5 bg-white rounded-full shadow-sm border border-slate-100 cursor-pointer">
          <Bell size={20} className="text-slate-600" />
          <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
        </div>

        <div className="flex items-center gap-3 bg-[#3B82F6] text-white pr-6 pl-1.5 py-1.5 rounded-full shadow-lg">
          <div className="bg-white p-2 rounded-full text-blue-600">
            <User size={18} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none">Ahli</span>
            <span className="text-[10px] opacity-80 font-medium">ahli@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
