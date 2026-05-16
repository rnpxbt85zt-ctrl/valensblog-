import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/auth';
import { sanitizeHTML, sanitizeText, sanitizeSlug } from '@/lib/sanitize';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  const body = await req.json();

  // Sanitize all inputs
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.title !== undefined) updates.title = sanitizeText(body.title);
  if (body.slug !== undefined) updates.slug = sanitizeSlug(body.slug);
  if (body.summary !== undefined) updates.summary = sanitizeText(body.summary);
  if (body.content !== undefined) updates.content = sanitizeHTML(body.content);
  if (body.category !== undefined) updates.category = sanitizeText(body.category);
  if (body.cover_image_url !== undefined) updates.cover_image_url = sanitizeText(body.cover_image_url);
  if (body.status !== undefined && ['draft', 'published'].includes(body.status)) {
    updates.status = body.status;
    if (body.status === 'published') {
      // Set published_at only if not already set
      const { data: existing } = await supabaseAdmin
        .from('articles').select('published_at').eq('id', id).single();
      if (!existing?.published_at) updates.published_at = new Date().toISOString();
    }
  }

  const { data, error } = await supabaseAdmin
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  const { error } = await supabaseAdmin.from('articles').delete().eq('id', id);
  if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  return NextResponse.json({ success: true });
}
