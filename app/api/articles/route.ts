import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit, getIP } from '@/lib/rateLimit';
import { readingTime } from '@/lib/readingTime';

export async function GET(req: Request) {
  // Rate limiting
  const { ok } = rateLimit(getIP(req), 60, 60_000);
  if (!ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  let query = supabaseAdmin
    .from('articles')
    .select('id, title, slug, summary, cover_image_url, category, status, view_count, published_at, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });

  const articles = (data || []).map((a) => ({
    ...a,
    readingTime: readingTime(a.summary || ''),
  }));

  return NextResponse.json(articles);
}
