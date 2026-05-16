import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/auth';
import { rateLimit, getIP } from '@/lib/rateLimit';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: Request) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { ok } = rateLimit(getIP(req), 20, 60_000);
  if (!ok) return NextResponse.json({ error: 'Too many uploads' }, { status: 429 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: `File type ${file.type} not allowed` }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
  }

  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = await file.arrayBuffer();

  const { data, error } = await supabaseAdmin.storage
    .from('blog-uploads')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return NextResponse.json({ error: 'Upload failed' }, { status: 500 });

  const { data: urlData } = supabaseAdmin.storage
    .from('blog-uploads')
    .getPublicUrl(data.path);

  return NextResponse.json({
    url: urlData.publicUrl,
    name: file.name,
    type: file.type,
    size: file.size,
  });
}
