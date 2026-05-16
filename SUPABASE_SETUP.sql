-- Run this in Supabase → SQL Editor

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  summary TEXT,
  cover_image_url VARCHAR(500),
  category VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  view_count INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast slug lookup
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);

-- Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-uploads', 'blog-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of uploads
CREATE POLICY "Public read uploads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-uploads');

-- Allow authenticated (service key) to upload
CREATE POLICY "Service key upload"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'blog-uploads');
