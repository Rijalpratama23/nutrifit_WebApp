import { Mail, MessageSquare, CheckCircle } from "lucide-react"


export default function StatisticCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5 border border-white">
        <div className="p-4 bg-green-50 rounded-xl text-green-500">
          <Mail size={28} />
        </div>
        <div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Permintaan Baru</p>
          <h2 className="text-3xl font-bold text-slate-800">6</h2>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5 border border-white">
        <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
          <MessageSquare size={28} />
        </div>
        <div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Konsultasi Aktif</p>
          <h2 className="text-3xl font-bold text-slate-800">10</h2>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5 border border-white">
        <div className="p-4 bg-green-50 rounded-xl text-green-500">
          <CheckCircle size={28} />
        </div>
        <div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Selesai</p>
          <h2 className="text-3xl font-bold text-slate-800">0</h2>
        </div>
      </div>
    </div>
  );
}
