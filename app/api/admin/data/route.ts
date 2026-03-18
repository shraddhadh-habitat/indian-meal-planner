import { NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const admin = createSupabaseAdmin();

  const [
    { data: _visits, count: visitCount },
    { data: recentVisits },
    { data: groups },
    { data: telegramChats },
    { data: { users: authUsers } },
  ] = await Promise.all([
    admin.from('visits').select('*', { count: 'exact', head: true }),
    admin.from('visits').select('*').order('created_at', { ascending: false }).limit(50),
    admin.from('groups').select('*, group_members(count)').order('created_at', { ascending: false }),
    admin.from('telegram_chats').select('*').order('created_at', { ascending: false }),
    admin.auth.admin.listUsers({ perPage: 100 }),
  ]);

  return NextResponse.json({ visitCount, recentVisits, groups, telegramChats, authUsers });
}
