import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
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
