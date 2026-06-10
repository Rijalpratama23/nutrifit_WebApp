import PageTotalKonsultasi from '@/components/componentsDashboardAdmin/totalKonsultasi/page';
import { createClient } from '@/utils/supabase/server';

export default async function TotalKonsultasi() {
  const supabase = await createClient();

  // Fetch secara terpisah agar 1 error tidak block semua
  const [totalResult, selesaiResult, dibatalkanResult, kategoriResult] = await Promise.allSettled([
    supabase.from('consultations').select('*', { count: 'exact', head: true }),
    supabase.from('consultations').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('consultations').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
    supabase.rpc('get_konsultasi_by_kategori'),
  ]);

  // Debug log - hapus setelah fix
  console.log('total error:', totalResult.status === 'rejected' ? totalResult.reason : (totalResult.value as any).error);
  console.log('total count:', totalResult.status === 'fulfilled' ? (totalResult.value as any).count : 0);

  const totalKonsultasi = totalResult.status === 'fulfilled' ? ((totalResult.value as any).count ?? 0) : 0;
  const totalSelesai = selesaiResult.status === 'fulfilled' ? ((selesaiResult.value as any).count ?? 0) : 0;
  const totalDibatalkan = dibatalkanResult.status === 'fulfilled' ? ((dibatalkanResult.value as any).count ?? 0) : 0;
  const kategoriData = kategoriResult.status === 'fulfilled' ? ((kategoriResult.value as any).data ?? []) : [];

  return <PageTotalKonsultasi totalKonsultasi={totalKonsultasi} totalSelesai={totalSelesai} totalDibatalkan={totalDibatalkan} kategoriData={kategoriData} />;
}
