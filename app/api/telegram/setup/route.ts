import { NextRequest, NextResponse } from 'next/server';

// GET /api/telegram/setup?url=https://yourdomain.com
// Registers the Telegram webhook. Call this once after deploy.
export async function GET(request: NextRequest) {
  const siteUrl =
    request.nextUrl.searchParams.get('url') ??
    process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return NextResponse.json({ error: 'Provide ?url=https://yourdomain.com' }, { status: 400 });
  }

  const webhookUrl = `${siteUrl}/api/telegram`;
  const token = process.env.TELEGRAM_BOT_TOKEN!;

  const res = await fetch(
    `https://api.telegram.org/bot${token}/setWebhook`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl }),
    }
  );

  const data = await res.json();
  return NextResponse.json({ webhookUrl, telegram: data });
}
