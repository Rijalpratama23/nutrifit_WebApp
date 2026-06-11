import PageDashboardAdmin from '@/components/componentsDashboardAdmin/dashboardAdmin/page';
import { createAdminClient } from '@/utils/supabase/admin'

export default async function DashboardAdmin() {

  const supabase = createAdminClient()

  const [
    { count: totalPengguna },
    { count: totalAhli },
    { count: totalKonsultasi },
    { count: totalArtikel },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'ahli'),
    supabase.from('consultations').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
  ]);

  return <PageDashboardAdmin totalPengguna={totalPengguna ?? 0} totalAhli={totalAhli ?? 0} totalKonsultasi={totalKonsultasi ?? 0} totalArtikel={totalArtikel ?? 0} />;
}