import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';
import { fixedDefaultPlan, DAYS } from '@/app/data/weeklyPlan';
import { getRecipeById } from '@/app/data/recipes';

export const runtime = 'nodejs';

// GET /api/cron/daily-meal
// Called by Vercel Cron at 1:30 UTC (7:00 AM IST) daily.
// Protected by Authorization: Bearer <CRON_SECRET>
export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (auth !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone: 'Asia/Kolkata',
  });

  const meals = fixedDefaultPlan[today];
  if (!meals) {
    return NextResponse.json({ error: `No plan for ${today}` }, { status: 404 });
  }

  const b = getRecipeById(meals.breakfast);
  const l = getRecipeById(meals.lunch);
  const d = getRecipeById(meals.dinner);
  const totalProtein =
    ((b?.proteinPerServing ?? 0) + (l?.proteinPerServing ?? 0) + (d?.proteinPerServing ?? 0)) * 3;

  const text =
    `🍛 <b>Good morning! ${today}'s Meal Plan</b>\n\n` +
    `☀️ <b>Breakfast:</b> ${b?.name ?? meals.breakfast}\n` +
    (b?.cookTime ? `   ⏱ ${b.cookTime} min\n` : '') +
    `\n🌤 <b>Lunch:</b> ${l?.name ?? meals.lunch}\n` +
    (l?.cookTime ? `   ⏱ ${l.cookTime} min\n` : '') +
    `\n🌙 <b>Dinner:</b> ${d?.name ?? meals.dinner}\n` +
    (d?.cookTime ? `   ⏱ ${d.cookTime} min\n` : '') +
    `\n💪 Total protein (3 people): ~${totalProtein}g\n\n` +
    `Reply /week for the full week plan`;

  // Get all subscribers
  const admin = createSupabaseAdmin();
  const { data: chats, error } = await admin
    .from('telegram_chats')
    .select('chat_id');

  if (error || !chats?.length) {
    return NextResponse.json({ sent: 0, today });
  }

  // Send to all subscribers in parallel (max 30 concurrent)
  const results = await Promise.allSettled(
    chats.map(({ chat_id }) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text, parse_mode: 'HTML' }),
      })
    )
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  return NextResponse.json({ sent, total: chats.length, today });
}
