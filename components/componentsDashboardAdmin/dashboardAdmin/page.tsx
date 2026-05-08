import SideBarAdmin from '../SideBarAdmin/page';
import ContainerDashboardAdmin from './ui/page';

export default function PageDashboardAdmin() {
  return (
    <div className="min-h-screen bg-[#F0F7FF] flex">
      <SideBarAdmin />
      <ContainerDashboardAdmin />
    </div>
  );
}
