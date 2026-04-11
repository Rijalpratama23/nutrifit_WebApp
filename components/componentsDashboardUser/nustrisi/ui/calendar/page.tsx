'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '@/hooks/useCalendar';
import { getDayNameShort, CalendarDay } from '@/lib/libUser/calendar/dateUtils';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date | null;
}

export default function Calendar({ onDateSelect }: CalendarProps) {
  const { monthName, year, calendarDays, selectedDate, goToPreviousMonth, goToNextMonth, handleDateClick } = useCalendar();

  const handleDayClick = (day: CalendarDay) => {
    handleDateClick(day);
    if (onDateSelect) {
      onDateSelect(day.fullDate);
    }
  };

  // Header hari minggu
  const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-4">
      {/* Header dengan navigasi bulan/tahun */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={goToPreviousMonth} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>

        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800">
            {monthName} {year}
          </h3>
        </div>

        <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Day headers (Min, Sen, Sel, etc) */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayHeaders.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isSelected = selectedDate && day.fullDate.getDate() === selectedDate.getDate() && day.fullDate.getMonth() === selectedDate.getMonth() && day.fullDate.getFullYear() === selectedDate.getFullYear();

          return (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              className={`
                p-2 rounded-md text-center text-sm font-semibold
                transition-all duration-200
                ${!day.isCurrentMonth ? 'text-gray-300 bg-gray-50 cursor-default' : 'text-gray-700 hover:bg-blue-100'}
                ${day.isToday ? 'bg-blue-500 text-white font-bold' : ''}
                ${isSelected && day.isCurrentMonth ? 'bg-green-500 text-white font-bold' : ''}
              `}
            >
              {day.date}
            </button>
          );
        })}
      </div>

      {/* Footer - selected date display */}
      {selectedDate && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Tanggal dipilih:</span>
          </p>
          <p className="text-center text-lg font-bold text-green-600 mt-2">
            {selectedDate.toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
}
