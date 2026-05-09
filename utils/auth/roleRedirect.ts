import { createClient } from '@/utils/supabase/server';

// Ambil role user berdasarkan id-nya
export async function getUserRole(userId: string): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('users').select('role').eq('id', userId).single();

  if (error || !data) return 'user'; // fallback
  return data.role;
}

// Tentukan URL tujuan berdasarkan role
export function getRedirectByRole(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'ahli':
      return '/ahli/home';
    default:
      return '/user/dashboardUser';
  }
}
