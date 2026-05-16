'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from '@/app/layout';
import { translations } from '@/lib/translations';

const CATEGORIES = ['Swimming', 'Travel', 'Business', 'Lifestyle', 'Education', 'Personal Growth'];

export default function ArticlesPage() {
  const { lang } = useLang();
  const t = translations[lang];
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    setLoading(true);
    const url = category === 'all' ? '/api/articles' : `/api/articles?category=${category}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setArticles(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: '2.5rem', marginBottom: '2rem' }}>
          {t.articlesTitle}
        </h1>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCategory('all')}
            className={`btn ${category === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '.4rem 1rem', fontSize: '.85rem' }}
          >
            {t.allCategories}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`btn ${category === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '.4rem 1rem', fontSize: '.85rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
            {[1,2,3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '320px' }} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <p style={{ color: 'var(--text2)', textAlign: 'center', padding: '4rem 0' }}>{t.noPosts}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
            {articles.map((article) => (
              <Link key={article.id} href={`/article/${article.slug}`} className="card" style={{ display: 'block' }}>
                {article.cover_image_url && (
                  <img src={article.cover_image_url} alt={article.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '1.25rem' }}>
                  {article.category && (
                    <span className="badge badge-blue" style={{ marginBottom: '.75rem', display: 'inline-block' }}>
                      {article.category}
                    </span>
                  )}
                  <h2 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '1.15rem', marginBottom: '.5rem', lineHeight: 1.4 }}>
                    {article.title}
                  </h2>
                  {article.summary && (
                    <p style={{ color: 'var(--text2)', fontSize: '.9rem', marginBottom: '1rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {article.summary}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text2)', fontSize: '.8rem' }}>
                    <span>📖 {article.readingTime} {t.minRead}</span>
                    <span>👁 {article.view_count} {t.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
