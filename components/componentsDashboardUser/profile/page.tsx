import { User } from 'lucide-react';
import Header from '../konsultasiUser/ui/header/page';
import BtnSet from './ui/setBtn/page';
import SideBar from './ui/sidBar/page';
import Main from './ui/main/page';
import TargetPage from './ui/target/page';
import PersonalHealth from './ui/healthPersonal/page';

export default function ProfilePage() {
  return (
    <div className="w-full min-h-screen bg-white px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 mt-4 sm:mt-8 md:mt-16 lg:mt-20 pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-8 sm:pb-10 md:pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 sm:gap-6">
        <Header icon={<User size={40} className="w-6 sm:w-8 md:w-10 lg:w-10" />} title="Profile" subTitle="Kelola identitas dan tujuan anda" />
        <BtnSet />
      </div>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-6 sm:mt-8 md:mt-10 max-w-7xl mx-auto">
        {/* Sidebar */}
        <SideBar />
        {/* Main Content */}
        <div className="flex-1 w-full">
          <Main />
          <TargetPage />
          <PersonalHealth />
        </div>
      </div>
    </div>
  );
}
