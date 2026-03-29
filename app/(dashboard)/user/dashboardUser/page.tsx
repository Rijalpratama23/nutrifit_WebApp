import Image from 'next/image';
import AppBar from '@/components/componentsDashboardUser/appBar/page';
import DashboardUser from '@/components/componentsDashboardUser/home/page';

export default function UserDashboard() {
  return (
    <>
      <AppBar />
      <DashboardUser />
    </>
  );
}
