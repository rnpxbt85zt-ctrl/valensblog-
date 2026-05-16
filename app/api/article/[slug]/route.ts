import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit, getIP } from '@/lib/rateLimit';
import { readingTime } from '@/lib/readingTime';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { ok } = rateLimit(getIP(req), 60, 60_000);
  if (!ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

  // Increment view count
  await supabaseAdmin
    .from('articles')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('slug', params.slug);

  return NextResponse.json({ ...data, readingTime: readingTime(data.content) });
}
