'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLang } from '@/app/layout';
import { translations } from '@/lib/translations';

export default function ArticlePage() {
  const params = useParams();
  const { lang } = useLang();
  const t = translations[lang];
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/article/${params.slug}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setArticle)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return (
    <div className="container-narrow" style={{ padding: '4rem 0' }}>
      <div className="skeleton" style={{ height: '40px', marginBottom: '1rem' }} />
      <div className="skeleton" style={{ height: '300px' }} />
    </div>
  );

  if (notFound || !article) return (
    <div className="container-narrow" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font)', marginBottom: '1rem' }}>Article not found</h1>
      <Link href="/articles" className="btn btn-primary">← Back to articles</Link>
    </div>
  );

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container-narrow">
        <Link href="/articles" style={{ color: 'var(--text2)', fontSize: '.9rem', display: 'inline-flex', alignItems: 'center', gap: '.4rem', marginBottom: '2rem' }}>
          ← {t.articles}
        </Link>

        {article.category && (
          <span className="badge badge-blue" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            {article.category}
          </span>
        )}

        <h1 style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.25, marginBottom: '1rem' }}>
          {article.title}
        </h1>

        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text2)', fontSize: '.85rem', marginBottom: '2rem' }}>
          <span>📖 {article.readingTime} {t.minRead}</span>
          <span>👁 {article.view_count} {t.views}</span>
          {article.published_at && (
            <span>📅 {new Date(article.published_at).toLocaleDateString()}</span>
          )}
        </div>

        {article.cover_image_url && (
          <img
            src={article.cover_image_url}
            alt={article.title}
            style={{ width: '100%', borderRadius: 'var(--radius)', marginBottom: '2rem', maxHeight: '450px', objectFit: 'cover' }}
          />
        )}

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
}
