import Header from '@/components/componentsDashboardUser/konsultasiUser/ui/header/page';
import { Stethoscope } from 'lucide-react';
import DatePicker from '../calendar/page.';
import { useState } from 'react';

export default function HeaderNutrisi() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log('Tanggal dipilih:', date);
  };
  return (
    <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
      <Header icon={<Stethoscope size={40} className="w-8 sm:w-10 md:w-12 lg:w-[40px]" />} title="Rencana Nutrisi" subTitle="Rencanan Nutrisi berdasarkan data kesehatan anda" />
      <DatePicker onDateSelect={handleDateSelect} />
    </div>
  );
}
