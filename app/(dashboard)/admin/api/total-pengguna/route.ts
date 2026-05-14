import { supabaseAdmin } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalPengguna },
    { count: penggunaBaru },
    { count: penggunaAktif },
  ] = await Promise.all([
    // Total semua user
    supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user'),

    // Pengguna baru bulan ini
    supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user')
      .gte('created_at', startOfMonth),

    // Pengguna aktif 30 hari terakhir
    supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user')
      .gte('updated_at', thirtyDaysAgo),
  ]);

  const total = totalPengguna ?? 0;
  const baru = penggunaBaru ?? 0;
  const aktif = penggunaAktif ?? 0;
  const rataRata = total > 0 ? Math.round((aktif / total) * 100) : 0;

  return NextResponse.json({
    totalPengguna: total,
    penggunaBaru: baru,
    penggunaAktif: aktif,
    rataRataAktivitas: rataRata,
    persenBaru: total > 0 ? Math.round((baru / total) * 100) : 0,
    persenAktif: rataRata,
  });
}