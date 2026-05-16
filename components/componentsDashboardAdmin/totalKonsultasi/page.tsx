import SideBarAdmin from '../SideBarAdmin/page';
import ContainerTotalKonsultasi from './ui/page';

interface KategoriItem {
  kategori: string;
  total: number;
}

interface Props {
  totalKonsultasi: number;
  totalSelesai: number;
  totalDibatalkan: number;
  kategoriData: KategoriItem[];
}

export default function PageTotalKonsultasi({ totalKonsultasi, totalSelesai, totalDibatalkan, kategoriData }: Props) {
  return (
    <div className="min-h-screen bg-[#F0F7FF] flex">
      <SideBarAdmin />
      <ContainerTotalKonsultasi totalKonsultasi={totalKonsultasi} totalSelesai={totalSelesai} totalDibatalkan={totalDibatalkan} kategoriData={kategoriData} />
    </div>
  );
}
