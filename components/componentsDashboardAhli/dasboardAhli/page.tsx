import SideBar from '../sideBar/page';
import ContainerDashboard from './ui/page';


export default function PageDashboard() {
  const dataKonsultasi = [
   
  ];

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex">
      {/* Sidebar melayang karena class 'fixed' */}
      <SideBar />

      {/* kontent */}
      <ContainerDashboard />
    </div>
  );
}
