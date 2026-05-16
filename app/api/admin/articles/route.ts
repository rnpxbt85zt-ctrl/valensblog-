import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/auth';
import { sanitizeHTML, sanitizeText, sanitizeSlug } from '@/lib/sanitize';
import { rateLimit, getIP } from '@/lib/rateLimit';
import { readingTime } from '@/lib/readingTime';

export async function GET(req: Request) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });

  return NextResponse.json(
    (data || []).map((a) => ({ ...a, readingTime: readingTime(a.content) }))
  );
}

export async function POST(req: Request) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { ok } = rateLimit(getIP(req), 20, 60_000);
  if (!ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const body = await req.json();

  // Sanitize all inputs
  const title = sanitizeText(body.title || '');
  const slug = sanitizeSlug(body.slug || body.title || '');
  const summary = sanitizeText(body.summary || '');
  const content = sanitizeHTML(body.content || '');
  const category = sanitizeText(body.category || '');
  const status = ['draft', 'published'].includes(body.status) ? body.status : 'draft';
  const coverImageUrl = sanitizeText(body.cover_image_url || '');

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'Title, slug and content are required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('articles')
    .insert({
      title,
      slug,
      summary,
      content,
      category,
      status,
      cover_image_url: coverImageUrl,
      view_count: 0,
      published_at: status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
