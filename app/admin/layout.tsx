'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    fetch('/api/admin/articles', { method: 'GET' })
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false));
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { setAuthed(true); }
      else { setError('Wrong password. Try again.'); }
    } catch { setError('Connection error.'); }
    finally { setLoading(false); }
  };

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthed(false);
    router.push('/admin');
  };

  // Loading state
  if (authed === null) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  // Login screen
  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <h1 style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: '2rem', marginBottom: '.5rem', textAlign: 'center' }}>
          Admin Panel
        </h1>
        <p style={{ color: 'var(--text2)', textAlign: 'center', marginBottom: '2rem', fontSize: '.9rem' }}>
          Valen&apos;s Journey Blog
        </p>
        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
            />
          </div>
          {error && <p style={{ color: '#f87171', fontSize: '.9rem' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--text2)', fontSize: '.85rem' }}>← Back to blog</Link>
        </p>
      </div>
    </div>
  );

  // Admin dashboard layout
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px', background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '.5rem',
        position: 'sticky', top: 0, height: '100vh', flexShrink: 0,
      }}>
        <p style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: '1rem', color: 'var(--text)', padding: '.5rem', marginBottom: '.5rem' }}>
          ✍️ Admin
        </p>

        {[
          { href: '/admin', label: '📊 Dashboard' },
          { href: '/admin/posts', label: '📝 Posts' },
          { href: '/admin/posts/new', label: '✨ New Post' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '.6rem .75rem', borderRadius: '8px', fontSize: '.9rem',
              color: path === item.href ? 'var(--accent2)' : 'var(--text2)',
              background: path === item.href ? 'rgba(59,130,246,.1)' : 'transparent',
              fontWeight: path === item.href ? 600 : 400,
              transition: 'all .15s',
            }}
          >
            {item.label}
          </Link>
        ))}

        <div style={{ marginTop: 'auto' }}>
          <Link href="/" style={{ padding: '.6rem .75rem', borderRadius: '8px', fontSize: '.9rem', color: 'var(--text2)', display: 'block', marginBottom: '.5rem' }}>
            🌐 View Blog
          </Link>
          <button
            onClick={logout}
            className="btn btn-outline"
            style={{ width: '100%', fontSize: '.85rem', padding: '.5rem' }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
