import CardKonsul from '../cardKonsul/page';
import { Consultation } from '../../page';

interface ContainerCardProps {
  consultations: Consultation[];
  loading: boolean;
  onRefresh: () => void;
}

export default function ContainerCard({ consultations, loading, onRefresh }: ContainerCardProps) {
  // Loading state
  if (loading) {
    return (
      <div className="border rounded-xl p-5 md:p-6 space-y-4 min-h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
          <p className="text-sm">Memuat konsultasi...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (consultations.length === 0) {
    return (
      <div className="border rounded-xl p-5 md:p-6 min-h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <p className="text-4xl">🩺</p>
          <p className="text-sm font-medium">Belum ada konsultasi</p>
          <p className="text-xs text-gray-400">Mulai konsultasi dengan ahli gizi kami</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-5 md:p-2 space-y-4 sm:space-y-6 max-h-[320px] sm:max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-thumb-gray-600 scrollbar-track-gray-100 scrollbar scrollbar-w-2">
      {consultations.map((consultation) => (
        <CardKonsul key={consultation.id} consultation={consultation} onRefresh={onRefresh} />
      ))}
    </div>
  );
}
