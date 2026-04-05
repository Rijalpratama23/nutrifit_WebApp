/**
 * Utility functions untuk kalender
 * Fungsi-fungsi di sini menangani logika kalender murni (tidak ada React)
 */

export interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  fullDate: Date;
}

/**
 * Mendapatkan jumlah hari dalam sebuah bulan
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Mendapatkan hari pertama dalam bulan (0 = Minggu, 6 = Sabtu)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Mendapatkan nama bulan dalam bahasa Indonesia
 */
export function getMonthName(month: number): string {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return months[month];
}

/**
 * Mendapatkan nama hari dalam bahasa Indonesia (singkat)
 */
export function getDayNameShort(dayIndex: number): string {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  return days[dayIndex];
}

/**
 * Memeriksa apakah dua tanggal adalah hari yang sama
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

/**
 * Generate array days untuk ditampilkan dalam calendar view
 * Termasuk hari dari bulan sebelumnya dan sesudahnya
 */
export function generateCalendarDays(year: number, month: number): CalendarDay[] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const days: CalendarDay[] = [];

  // Hari dari bulan sebelumnya
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    const date = daysInPrevMonth - i;
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      fullDate: new Date(year, month - 1, date),
    });
  }

  // Hari dalam bulan saat ini
  for (let date = 1; date <= daysInMonth; date++) {
    const fullDate = new Date(year, month, date);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isSameDay(fullDate, today),
      fullDate,
    });
  }

  // Hari dari bulan berikutnya
  const remainingDays = 42 - days.length; // 6 baris x 7 hari
  for (let date = 1; date <= remainingDays; date++) {
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      fullDate: new Date(year, month + 1, date),
    });
  }

  return days;
}

/**
 * Format tanggal ke string Indonesia
 */
export function formatDateIndonesia(date: Date): string {
  const day = date.getDate();
  const month = getMonthName(date.getMonth());
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

/**
 * Parse tanggal yang dipilih dan kembalikan dalam format yang mudah dibaca
 */
export function getSelectedDateDisplay(date: Date): {
  day: string;
  date: number;
  month: string;
  year: number;
} {
  return {
    day: getDayNameShort(date.getDay()),
    date: date.getDate(),
    month: getMonthName(date.getMonth()),
    year: date.getFullYear(),
  };
}
