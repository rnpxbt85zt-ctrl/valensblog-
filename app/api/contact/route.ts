import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit, getIP } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/sanitize';

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const NOTIFY_EMAIL = 'valentindefrutos1@gmail.com';

export async function POST(req: Request) {
  const { ok } = rateLimit(getIP(req), 3, 60_000);
  if (!ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const body = await req.json();

  const name = sanitizeText(body.name || '').slice(0, 100);
  const email = sanitizeText(body.email || '').slice(0, 200);
  const message = sanitizeText(body.message || '').slice(0, 2000);

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // Save to Supabase
  const { error: dbError } = await supabaseAdmin
    .from('contact_messages')
    .insert({ name, email, message });

  if (dbError) {
    console.error('DB error:', dbError);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }

  // Send email notification via Resend
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Valen\'s Blog <onboarding@resend.dev>',
        to: NOTIFY_EMAIL,
        subject: `New message from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">New contact message 📬</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin-top: 0.5rem;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <hr style="margin-top: 2rem; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 0.85rem;">Sent from Valen's Journey blog</p>
          </div>
        `,
      }),
    });
  } catch (emailError) {
    // Don't fail the request if email fails — message is already saved in DB
    console.error('Email error:', emailError);
  }

  return NextResponse.json({ success: true });
}
