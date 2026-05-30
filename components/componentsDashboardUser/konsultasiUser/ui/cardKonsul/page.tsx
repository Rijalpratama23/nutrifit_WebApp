'use client';

import { useRouter } from 'next/navigation';
import { MessageCircleMore, User, CalendarDays } from 'lucide-react';
import { Consultation } from '../../page';

interface CardKonsulProps {
  consultation: Consultation;
  onRefresh: () => void;
}

// ─── Helper Status ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    active: { label: 'Aktif', className: 'bg-green-100 text-green-700' },
    scheduled: { label: 'Terjadwal', className: 'bg-blue-100 text-blue-700' },
    pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-700' },
    completed: { label: 'Selesai', className: 'bg-gray-100 text-gray-600' },
    cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-600' },
  };

  const { label, className } = config[status] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-600',
  };

  return <span className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg ${className}`}>{label}</span>;
}

function formatTanggal(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Komponen ─────────────────────────────────────────────────────────────────

export default function CardKonsul({ consultation, onRefresh }: CardKonsulProps) {
  const router = useRouter();

  const handleChat = () => {
    router.push(`/konsultasi/chat/${consultation.id}`);
  };

  const showChat = consultation.status === 'active';
  const showSchedule = consultation.status === 'scheduled' || consultation.status === 'pending';

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
      {/* Kiri: Info Ahli */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-start sm:items-center">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {consultation.ahli_photo_url ? (
            <img src={consultation.ahli_photo_url} alt={consultation.ahli_name} className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gray-200" />
          ) : (
            <div className="bg-white hover:border-blue-500 hover:cursor-pointer flex justify-center items-center p-3 sm:p-4 md:p-5 rounded-full border-2 border-gray-200 transition-colors">
              <User size={32} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg sm:text-xl md:text-2xl text-gray-800">{consultation.ahli_name}</h3>
          <p className="text-sm sm:text-base text-gray-500 mt-1">{consultation.ahli_specialization}</p>

          {/* Jadwal — tampil jika terjadwal/pending */}
          {showSchedule && consultation.scheduled_at && (
            <div className="flex items-center gap-2 mt-3 text-primary">
              <CalendarDays size={14} className="flex-shrink-0" />
              <p className="text-xs sm:text-sm font-medium">Jadwal Berikutnya: {formatTanggal(consultation.scheduled_at)}</p>
            </div>
          )}

          {/* Tombol Chat — tampil jika aktif */}
          {showChat && (
            <div className="mt-4 sm:mt-5">
              <button
                onClick={handleChat}
                className="flex justify-center sm:justify-start items-center gap-2 bg-secondary text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-all duration-200 hover:cursor-pointer text-sm sm:text-base font-medium w-full sm:w-auto"
              >
                <MessageCircleMore size={18} />
                <span>Chat</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Kanan: Status Badge */}
      <div className="flex sm:flex-col justify-end sm:justify-start items-start sm:items-end">
        <StatusBadge status={consultation.status} />
      </div>
    </div>
  );
}
