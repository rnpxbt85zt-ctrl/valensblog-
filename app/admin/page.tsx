'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/articles')
      .then((r) => r.json())
      .then((d) => { setArticles(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const published = articles.filter((a) => a.status === 'published').length;
  const drafts = articles.filter((a) => a.status === 'draft').length;
  const totalViews = articles.reduce((s, a) => s + (a.view_count || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: '1.8rem' }}>Dashboard</h1>
        <Link href="/admin/posts/new" className="btn btn-primary">✨ New Post</Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Posts', value: articles.length, color: 'var(--accent2)' },
          { label: 'Published', value: published, color: '#4ade80' },
          { label: 'Drafts', value: drafts, color: '#facc15' },
          { label: 'Total Views', value: totalViews.toLocaleString(), color: 'var(--text)' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
            <p style={{ color: 'var(--text2)', fontSize: '.8rem', marginBottom: '.4rem' }}>{stat.label}</p>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: '2rem', color: stat.color }}>{loading ? '—' : stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent posts */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font)', fontWeight: 700 }}>Recent Posts</h2>
          <Link href="/admin/posts" style={{ color: 'var(--accent2)', fontSize: '.9rem' }}>View all →</Link>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: '50px' }} />)}
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text2)', marginBottom: '1rem' }}>No posts yet!</p>
            <Link href="/admin/posts/new" className="btn btn-primary">Create your first post</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {articles.slice(0, 8).map((a) => (
              <Link
                key={a.id}
                href={`/admin/posts/${a.id}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.75rem', borderRadius: '8px', background: 'var(--bg2)', transition: 'background .15s' }}
              >
                <span style={{ fontWeight: 500, fontSize: '.95rem' }}>{a.title}</span>
                <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text2)', fontSize: '.8rem' }}>👁 {a.view_count}</span>
                  <span className={`badge ${a.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>
                    {a.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
