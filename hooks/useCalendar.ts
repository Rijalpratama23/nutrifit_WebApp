'use client';

import { useState, useCallback } from 'react';
import { generateCalendarDays, CalendarDay, getMonthName } from '@/lib/libUser/calendar/dateUtils';

export function useCalendar(initialDate: Date = new Date()) {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generate array hari untuk ditampilkan
  const calendarDays = generateCalendarDays(year, month);

  // Pindah ke bulan sebelumnya
  const goToPreviousMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }, []);

 
  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }, []);

  // Pindah ke bulan/tahun tertentu
  const goToMonth = useCallback((month: number, year: number) => {
    setCurrentDate(new Date(year, month, 1));
  }, []);

  // Reset ke hari ini
  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  // Handle click pada tanggal
  const handleDateClick = useCallback((date: CalendarDay) => {
    setSelectedDate(date.fullDate);
  }, []);

  // Pindah tahun
  const goToYear = useCallback((year: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(year);
      return newDate;
    });
  }, []);

  return {
    currentDate,
    selectedDate,
    year,
    month,
    monthName: getMonthName(month),
    calendarDays,
    goToPreviousMonth,
    goToNextMonth,
    goToMonth,
    goToToday,
    goToYear,
    handleDateClick,
  };
}
