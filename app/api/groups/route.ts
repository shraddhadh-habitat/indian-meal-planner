import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin, createSupabaseServerClient } from '@/lib/supabase-server';

function generateShareCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// POST /api/groups — create a new group
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await request.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Group name required' }, { status: 400 });
  }

  const admin = createSupabaseAdmin();
  const shareCode = generateShareCode();

  const { data: group, error } = await admin
    .from('groups')
    .insert({ name: name.trim(), share_code: shareCode, created_by: user.id })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Add creator as member
  await admin.from('group_members').insert({
    group_id: group.id,
    user_id: user.id,
  });

  return NextResponse.json(group);
}
