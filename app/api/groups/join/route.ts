import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin, createSupabaseServerClient } from '@/lib/supabase-server';

// POST /api/groups/join — join a group by share code
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { code } = await request.json();
  if (!code?.trim()) {
    return NextResponse.json({ error: 'Share code required' }, { status: 400 });
  }

  const admin = createSupabaseAdmin();

  const { data: group, error: groupError } = await admin
    .from('groups')
    .select('*')
    .eq('share_code', code.trim().toUpperCase())
    .single();

  if (groupError || !group) {
    return NextResponse.json({ error: 'Group not found' }, { status: 404 });
  }

  // Upsert membership (idempotent)
  await admin.from('group_members').upsert(
    { group_id: group.id, user_id: user.id },
    { onConflict: 'group_id,user_id' }
  );

  return NextResponse.json(group);
}
