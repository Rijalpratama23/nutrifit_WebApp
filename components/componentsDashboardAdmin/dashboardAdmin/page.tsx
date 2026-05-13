import SideBarAdmin from '../SideBarAdmin/page';
import ContainerDashboardAdmin from './ui/page';

interface Props {
  totalPengguna: number;
  totalAhli: number;
  totalKonsultasi: number;
  totalArtikel: number;
}

export default function PageDashboardAdmin({ totalPengguna, totalAhli, totalKonsultasi, totalArtikel }: Props) {
  return (
    <div className="min-h-screen bg-[#F0F7FF] flex">
      <SideBarAdmin />
      <ContainerDashboardAdmin totalPengguna={totalPengguna} totalAhli={totalAhli} totalKonsultasi={totalKonsultasi} totalArtikel={totalArtikel} />
    </div>
  );
}
