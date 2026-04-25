import SideBar from '../sideBar/page';
import ContainerDashboard from './ui/page';


export default function PageDashboard() {

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex">
      <SideBar />
      <ContainerDashboard />
    </div>
  );
}
