import Header from '@/components/componentsDashboardUser/konsultasiUser/ui/header/page';
import { Stethoscope } from 'lucide-react';

export default function HeaderNutrisi() {
  return (
    <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
      <Header icon={<Stethoscope size={40} className="w-8 sm:w-10 md:w-12 lg:w-[40px]" />} title="Rencana Nutrisi" subTitle="Rencanan Nutrisi berdasarkan data kesehatan anda" />
    </div>
  );
}
