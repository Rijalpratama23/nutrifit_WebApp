import { supabaseAdmin } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: totalAhli }, { count: ahliBaruBulanIni }, { count: ahliVerified }] = await Promise.all([
    // Total semua ahli
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'ahli'),

    // Ahli baru bulan ini
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'ahli').gte('created_at', startOfMonth),

    // Ahli terverifikasi (join ahli_profiles)
    supabaseAdmin.from('ahli_profiles').select('*', { count: 'exact', head: true }).eq('is_verified', true),
  ]);

  const total = totalAhli ?? 0;
  const baru = ahliBaruBulanIni ?? 0;
  const verified = ahliVerified ?? 0;
  const persenVerified = total > 0 ? Math.round((verified / total) * 100) : 0;
  const persenBaru = total > 0 ? Math.round((baru / total) * 100) : 0;

  return NextResponse.json({
    totalAhli: total,
    ahliBaru: baru,
    ahliVerified: verified,
    rataRataAktivitas: persenVerified,
    persenBaru,
    persenVerified,
  });
}
