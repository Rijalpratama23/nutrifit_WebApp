import HeaderKonsul from '../konsultasiUser/ui/header/page';
import { NotepadText } from 'lucide-react';
import Container from './ui/container/page';
import TabNav from './ui/tabNav/page';

export default function PageProgram() {
  return (
    <div className="px-4 mt-5 md:mt-20 sm:px-6 md:px-8 lg:px-12 pt-6 sm:pt-8 md:pt-10 pb-8">
      <HeaderKonsul icon={<NotepadText size={40} className="sm:w-12 sm:h-12" />} title="Program Anda" subTitle="Kelola semua program kesehatan Anda" />
      <TabNav />
      <Container />
    </div>
  );
}
