import PageDashboardAdmin from '@/components/componentsDashboardAdmin/dashboardAdmin/page';
import { supabaseAdmin } from '@/utils/supabase/admin';

export default async function DashboardAdmin() {
  const [
    { count: totalPengguna },
    { count: totalAhli },
    { count: totalKonsultasi },
    { count: totalArtikel },
  ] = await Promise.all([
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user'),
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'ahli'),
    supabaseAdmin.from('consultations').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
  ]);

  return <PageDashboardAdmin totalPengguna={totalPengguna ?? 0} totalAhli={totalAhli ?? 0} totalKonsultasi={totalKonsultasi ?? 0} totalArtikel={totalArtikel ?? 0} />;
}
