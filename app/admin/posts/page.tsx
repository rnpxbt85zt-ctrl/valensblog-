'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPosts() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/articles')
      .then((r) => r.json())
      .then((d) => { setArticles(Array.isArray(d) ? d : []); setLoading(false); });
  };

  useEffect(load, []);

  const deletePost = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/article/${id}`, { method: 'DELETE' });
    setDeleting(null);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: '1.8rem' }}>All Posts</h1>
        <Link href="/admin/posts/new" className="btn btn-primary">✨ New Post</Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: '80px' }} />)}
        </div>
      ) : articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <p style={{ color: 'var(--text2)', marginBottom: '1rem' }}>No posts yet!</p>
          <Link href="/admin/posts/new" className="btn btn-primary">Create your first post</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {articles.map((a) => (
            <div
              key={a.id}
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.3rem' }}>
                  <span className={`badge ${a.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>
                    {a.status}
                  </span>
                  {a.category && <span className="badge badge-blue">{a.category}</span>}
                </div>
                <h2 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {a.title}
                </h2>
                <p style={{ color: 'var(--text2)', fontSize: '.8rem', marginTop: '.2rem' }}>
                  👁 {a.view_count} views · 📖 {a.readingTime} min
                </p>
              </div>
              <div style={{ display: 'flex', gap: '.5rem', flexShrink: 0 }}>
                <Link href={`/admin/posts/${a.id}`} className="btn btn-outline" style={{ padding: '.4rem .9rem', fontSize: '.85rem' }}>
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => deletePost(a.id, a.title)}
                  className="btn btn-danger"
                  disabled={deleting === a.id}
                  style={{ padding: '.4rem .9rem', fontSize: '.85rem' }}
                >
                  {deleting === a.id ? '...' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
