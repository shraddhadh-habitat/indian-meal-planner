/**
 * User preferences API — saves/loads avoidances, IBS mode, servings.
 *
 * Required Supabase table (run once in Supabase SQL Editor):
 *
 *   CREATE TABLE IF NOT EXISTS user_preferences (
 *     user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 *     avoidances TEXT[]   DEFAULT '{}',
 *     ibs_mode   BOOLEAN  DEFAULT FALSE,
 *     servings   INTEGER  DEFAULT 3,
 *     updated_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 *   ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "own preferences" ON user_preferences
 *     FOR ALL TO authenticated
 *     USING (auth.uid() = user_id)
 *     WITH CHECK (auth.uid() = user_id);
 */

import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('user_preferences')
      .select('avoidances, ibs_mode, servings')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json(data ?? { avoidances: [], ibs_mode: false, servings: 3 });
  } catch {
    return NextResponse.json({ avoidances: [], ibs_mode: false, servings: 3 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { avoidances, ibs_mode, servings } = body;

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        avoidances: avoidances ?? [],
        ibs_mode: ibs_mode ?? false,
        servings: servings ?? 3,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
