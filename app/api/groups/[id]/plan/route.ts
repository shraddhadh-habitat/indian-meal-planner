import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin, createSupabaseServerClient } from '@/lib/supabase-server';

// GET /api/groups/[id]/plan
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = createSupabaseAdmin();

  const { data, error } = await admin
    .from('group_plans')
    .select('plan, updated_at')
    .eq('group_id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ plan: null });
  }

  return NextResponse.json(data);
}

// PUT /api/groups/[id]/plan
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { plan } = await request.json();
  const admin = createSupabaseAdmin();

  // Verify user is a member of this group
  const { data: membership } = await admin
    .from('group_members')
    .select('group_id')
    .eq('group_id', id)
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { error } = await admin.from('group_plans').upsert(
    { group_id: id, plan, updated_at: new Date().toISOString() },
    { onConflict: 'group_id' }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
