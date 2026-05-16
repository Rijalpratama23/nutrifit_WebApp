import PageTotalKonsultasi from '@/components/componentsDashboardAdmin/totalKonsultasi/page';
import { createClient } from '@/utils/supabase/server';

export default async function TotalKonsultasi() {
  const supabase = await createClient();

  // Fetch semua stat secara paralel
  const [{ count: totalKonsultasi }, { count: totalSelesai }, { count: totalDibatalkan }, { data: kategoriData }] = await Promise.all([
    supabase.from('consultations').select('*', { count: 'exact', head: true }),
    supabase.from('consultations').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('consultations').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
    // Grup berdasarkan specialization ahli
    supabase.rpc('get_konsultasi_by_kategori'),
  ]);

  return <PageTotalKonsultasi totalKonsultasi={totalKonsultasi ?? 0} totalSelesai={totalSelesai ?? 0} totalDibatalkan={totalDibatalkan ?? 0} kategoriData={kategoriData ?? []} />;
}
