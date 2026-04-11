import { CheckCircle, XCircle, User } from 'lucide-react';
import { Data_User_Konsultasi } from '@/lib/libAhli/DUserKonsult/page';

export default function TdataUser() {
  return (
    <div className="bg-white rounded-[32px] shadow-sm p-8 border border-white ">
      <h3 className="text-xl font-bold text-slate-800 mb-4 font-sans">Permintaan Konsultasi Terbaru</h3>
      <div className="w-full h-1 bg-blue-600 rounded-full mb-8"></div>

      {/* Container dengan Scroll Vertikal Otomatis */}
      <div className="overflow-x-auto max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-slate-400 font-bold text-sm">
              <th className="pb-6 px-4 text-center">User</th>
              <th className="pb-6 px-4">Tujuan</th>
              <th className="pb-6 px-4 text-center">Waktu</th>
              <th className="pb-6 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {Data_User_Konsultasi.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                      <User size={20} />
                    </div>
                    <span className="font-bold text-slate-700">{item.user}</span>
                  </div>
                </td>
                <td className="py-5 px-4 text-slate-600 font-medium">{item.tujuan}</td>
                <td className="py-5 px-4 text-center text-slate-500 text-sm font-medium">{item.waktu}</td>
                <td className="py-5 px-4">
                  <div className="flex justify-center gap-3">
                    <button className="text-green-500 hover:scale-110 transition-transform">
                      <CheckCircle size={24} />
                    </button>
                    <button className="text-red-500 hover:scale-110 transition-transform">
                      <XCircle size={24} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="bg-[#3B82F6] hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all">Lihat Detail</button>
      </div>
    </div>
  );
}
