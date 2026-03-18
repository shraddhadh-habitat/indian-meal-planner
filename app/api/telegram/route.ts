import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const API = `https://api.telegram.org/bot${TOKEN}`;

async function sendMessage(chatId: number, text: string) {
  await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

// POST /api/telegram — Telegram webhook handler
export async function POST(request: NextRequest) {
  const body = await request.json();
  const message = body?.message;

  if (!message) {
    return NextResponse.json({ ok: true });
  }

  const chatId: number = message.chat?.id;
  const text: string = message.text ?? '';
  const admin = createSupabaseAdmin();

  if (text.startsWith('/start')) {
    // Subscribe this chat to daily meal plan
    await admin
      .from('telegram_chats')
      .upsert({ chat_id: chatId }, { onConflict: 'chat_id' });

    await sendMessage(
      chatId,
      `🍛 <b>Welcome to Aharam!</b>\n\nYou'll receive today's meal plan every morning at 7:00 AM IST.\n\nCommands:\n/today — today's meal plan\n/week — full week plan\n/stop — unsubscribe`
    );
  } else if (text.startsWith('/stop')) {
    await admin.from('telegram_chats').delete().eq('chat_id', chatId);
    await sendMessage(chatId, `✅ Unsubscribed. You won't receive daily plans anymore.\n\nSend /start to re-subscribe.`);
  } else if (text.startsWith('/today')) {
    const todayText = getTodayMealText();
    await sendMessage(chatId, todayText);
  } else if (text.startsWith('/week')) {
    const weekText = getWeekMealText();
    await sendMessage(chatId, weekText);
  } else {
    await sendMessage(
      chatId,
      `🍛 <b>Aharam</b>\n\nCommands:\n/today — today's meals\n/week — full week\n/stop — unsubscribe`
    );
  }

  return NextResponse.json({ ok: true });
}

function getTodayMealText(): string {
  // Dynamic import won't work here; use inline require for server-side data
  const { fixedDefaultPlan } = require('@/app/data/weeklyPlan');
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone: 'Asia/Kolkata',
  });
  const meals = fixedDefaultPlan[today];

  if (!meals) {
    return `🍛 No plan found for ${today}.`;
  }

  const { getRecipeById } = require('@/app/data/recipes');
  const b = getRecipeById(meals.breakfast);
  const l = getRecipeById(meals.lunch);
  const d = getRecipeById(meals.dinner);

  return (
    `🍛 <b>${today}'s Meal Plan</b>\n\n` +
    `☀️ <b>Breakfast:</b> ${b?.name ?? meals.breakfast}\n` +
    `🌤 <b>Lunch:</b> ${l?.name ?? meals.lunch}\n` +
    `🌙 <b>Dinner:</b> ${d?.name ?? meals.dinner}\n\n` +
    `💪 Protein: ~${((b?.proteinPerServing ?? 0) + (l?.proteinPerServing ?? 0) + (d?.proteinPerServing ?? 0)) * 3}g total\n\n` +
    `Open https://indian-meal-planner.vercel.app for the full recipe`
  );
}

function getWeekMealText(): string {
  const { fixedDefaultPlan, DAYS } = require('@/app/data/weeklyPlan');
  const { getRecipeById } = require('@/app/data/recipes');

  let text = `🍛 <b>This Week's Meal Plan</b>\n\n`;
  for (const day of DAYS) {
    const meals = fixedDefaultPlan[day];
    if (!meals) continue;
    const b = getRecipeById(meals.breakfast);
    const l = getRecipeById(meals.lunch);
    const d = getRecipeById(meals.dinner);
    text += `<b>${day}</b>\n☀️ ${b?.name ?? '—'}  🌤 ${l?.name ?? '—'}  🌙 ${d?.name ?? '—'}\n\n`;
  }
  return text.trim();
}
