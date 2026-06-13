// app/api/admin/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

// ── GET: fetch daftar user berdasarkan role ─────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role') ?? 'user'; // 'user' | 'ahli'

  const { data, error } = await supabaseAdmin.from('users').select('id, full_name, email, role, created_at, updated_at').eq('role', role).order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data });
}

// ── PATCH: edit role atau suspend (set role = 'suspended') ──────────────────
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, role } = body;

  if (!id || !role) {
    return NextResponse.json({ error: 'id dan role wajib diisi' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('users').update({ role, updated_at: new Date().toISOString() }).eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// ── DELETE: hapus akun user ─────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if (!id) return NextResponse.json({ error: 'id wajib diisi' }, { status: 400 });

  // Hapus dari auth.users (otomatis cascade ke tabel users jika ada FK)
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
