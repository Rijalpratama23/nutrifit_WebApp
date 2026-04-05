'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import CalendarComponent from './page';

interface DatePickerProps {
  onDateSelect?: (date: Date) => void;
}

export default function DatePicker({ onDateSelect }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsOpen(false);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <div className="relative">
      {/* Display tanggal yang dipilih */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex gap-3 items-center text-secondary font-bold bg-green-100 py-1 px-3.5 border border-green-300 rounded-sm text-base whitespace-nowrap hover:bg-green-200 transition"
      >
        <Calendar size={20} />
        <p className="font-semibold">
          {selectedDate.toLocaleDateString('id-ID', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </button>

      {/* Modal kalender */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <CalendarComponent onDateSelect={handleDateSelect} />
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
