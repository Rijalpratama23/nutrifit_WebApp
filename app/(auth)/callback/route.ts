import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserRole, getRedirectByRole } from '@/utils/auth/roleRedirect';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Ambil user yang baru saja login
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Cek role-nya di tabel users
        const role = await getUserRole(user.id);
        const redirectPath = getRedirectByRole(role);
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-failed`);
}