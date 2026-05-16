import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit, getIP } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/sanitize';

export async function POST(req: Request) {
  // Strict rate limit on contact — 3 per minute
  const { ok } = rateLimit(getIP(req), 3, 60_000);
  if (!ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const body = await req.json();

  const name = sanitizeText(body.name || '').slice(0, 100);
  const email = sanitizeText(body.email || '').slice(0, 200);
  const message = sanitizeText(body.message || '').slice(0, 2000);

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('contact_messages')
    .insert({ name, email, message });

  if (error) return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });

  return NextResponse.json({ success: true });
}
