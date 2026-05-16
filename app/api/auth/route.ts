import { NextResponse } from 'next/server';
import { validatePassword } from '@/lib/auth';
import { rateLimit, getIP } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/sanitize';

export async function POST(req: Request) {
  // Strict rate limit on login — 5 attempts per minute
  const { ok } = rateLimit(getIP(req), 5, 60_000);
  if (!ok) return NextResponse.json({ error: 'Too many attempts. Wait a minute.' }, { status: 429 });

  const body = await req.json();
  const password = sanitizeText(body.password || '');

  if (!validatePassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', process.env.SESSION_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}
