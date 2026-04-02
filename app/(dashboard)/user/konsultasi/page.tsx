import AppBar from '@/components/componentsDashboardUser/appBar/page';
import PageKonsultasi from '@/components/componentsDashboardUser/konsultasiUser/page';

export default function konsultasiUser() {
  return (
    <div id="konsultasi" className="min-h-screen bg-gray-50">
      <AppBar />
      <PageKonsultasi />
    </div>
  );
}
