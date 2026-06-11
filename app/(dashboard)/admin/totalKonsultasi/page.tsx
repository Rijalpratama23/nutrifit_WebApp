import PageTotalKonsultasi from '@/components/componentsDashboardAdmin/totalKonsultasi/page';
import { createAdminClient } from '@/utils/supabase/admin';

export default async function TotalKonsultasi() {
  const supabase = createAdminClient();

  const [totalResult, selesaiResult, dibatalkanResult, kategoriResult] = await Promise.allSettled([
    supabase.from('consultations').select('*', { count: 'exact', head: true }),
    supabase.from('consultations').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('consultations').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
    supabase.rpc('get_konsultasi_by_kategori'),
  ]);

  const totalKonsultasi = totalResult.status === 'fulfilled' ? ((totalResult.value as any).count ?? 0) : 0;
  const totalSelesai = selesaiResult.status === 'fulfilled' ? ((selesaiResult.value as any).count ?? 0) : 0;
  const totalDibatalkan = dibatalkanResult.status === 'fulfilled' ? ((dibatalkanResult.value as any).count ?? 0) : 0;
  const kategoriData = kategoriResult.status === 'fulfilled' ? ((kategoriResult.value as any).data ?? []) : [];

  return <PageTotalKonsultasi totalKonsultasi={totalKonsultasi} totalSelesai={totalSelesai} totalDibatalkan={totalDibatalkan} kategoriData={kategoriData} />;
}
