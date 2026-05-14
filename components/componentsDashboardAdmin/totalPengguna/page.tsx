import SideBarAdmin from '../SideBarAdmin/page';
import ContainerTotalPengguna from './ui/page';
import { supabaseAdmin } from '@/utils/supabase/admin';

export default async function PageTotalPengguna() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalPengguna },
    { count: penggunaBaru },
    { count: penggunaAktif },
  ] = await Promise.all([
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user'),
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user').gte('created_at', startOfMonth),
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user').gte('updated_at', thirtyDaysAgo),
  ]);

  const total = totalPengguna ?? 0;
  const baru = penggunaBaru ?? 0;
  const aktif = penggunaAktif ?? 0;
  const rataRata = total > 0 ? Math.round((aktif / total) * 100) : 0;
  const persenBaru = total > 0 ? Math.round((baru / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex">
      <SideBarAdmin />
      <ContainerTotalPengguna
        totalPengguna={total}
        penggunaBaru={baru}
        penggunaAktif={aktif}
        rataRataAktivitas={rataRata}
        persenBaru={persenBaru}
        persenAktif={rataRata}
      />
    </div>
  );
}