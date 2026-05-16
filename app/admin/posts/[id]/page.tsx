'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExt from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

const CATEGORIES = ['Swimming', 'Travel', 'Business', 'Lifestyle', 'Education', 'Personal Growth'];

// ── Toolbar ──────────────────────────────────────────────────────────────────
function Toolbar({ editor, onImageUpload }: { editor: any; onImageUpload: () => void }) {
  if (!editor) return null;
  const btn = (action: () => void, label: string, active?: boolean) => (
    <button
      type="button"
      onClick={action}
      title={label}
      style={{
        padding: '.3rem .5rem', borderRadius: '4px', border: 'none', cursor: 'pointer',
        background: active ? 'var(--accent)' : 'transparent',
        color: active ? '#fff' : 'var(--text)', fontSize: '.9rem', fontWeight: 600,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', gap: '.25rem', padding: '.5rem', background: 'var(--bg)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
      {btn(() => editor.chain().focus().toggleBold().run(), 'B', editor.isActive('bold'))}
      {btn(() => editor.chain().focus().toggleItalic().run(), 'I', editor.isActive('italic'))}
      {btn(() => editor.chain().focus().toggleStrike().run(), 'S̶', editor.isActive('strike'))}
      <div style={{ width: '1px', background: 'var(--border)', margin: '0 .25rem' }} />
      {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2', editor.isActive('heading', { level: 2 }))}
      {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3', editor.isActive('heading', { level: 3 }))}
      <div style={{ width: '1px', background: 'var(--border)', margin: '0 .25rem' }} />
      {btn(() => editor.chain().focus().toggleBulletList().run(), '• List', editor.isActive('bulletList'))}
      {btn(() => editor.chain().focus().toggleOrderedList().run(), '1. List', editor.isActive('orderedList'))}
      {btn(() => editor.chain().focus().toggleBlockquote().run(), '❝', editor.isActive('blockquote'))}
      {btn(() => editor.chain().focus().toggleCodeBlock().run(), '</>', editor.isActive('codeBlock'))}
      <div style={{ width: '1px', background: 'var(--border)', margin: '0 .25rem' }} />
      <button
        type="button"
        onClick={onImageUpload}
        title="Insert image"
        style={{ padding: '.3rem .6rem', borderRadius: '4px', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text)', fontSize: '.9rem' }}
      >
        🖼 Image
      </button>
      <button
        type="button"
        onClick={() => {
          const url = prompt('Enter URL:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        title="Add link"
        style={{ padding: '.3rem .6rem', borderRadius: '4px', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text)', fontSize: '.9rem' }}
      >
        🔗 Link
      </button>
    </div>
  );
}

// ── Main editor page ──────────────────────────────────────────────────────────
export default function PostEditor() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';
  const postId = isNew ? null : params.id;

  const [form, setForm] = useState({ title: '', slug: '', summary: '', category: '', status: 'draft', cover_image_url: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; url: string; type: string }[]>([]);
  const coverRef = useRef<HTMLInputElement>(null);
  const attachRef = useRef<HTMLInputElement>(null);
  const inlineImageRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      LinkExt.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing your post...' }),
    ],
    editorProps: {
      attributes: { class: 'tiptap-editor article-content' },
    },
  });

  // Load existing post
  useEffect(() => {
    if (isNew || !postId) return;
    fetch(`/api/admin/article/${postId}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          summary: data.summary || '',
          category: data.category || '',
          status: data.status || 'draft',
          cover_image_url: data.cover_image_url || '',
        });
        if (editor && data.content) editor.commands.setContent(data.content);
        // Load attachments from content metadata
        try {
          const match = data.content?.match(/<!--ATT:(.*?)-->/s);
          if (match) setAttachments(JSON.parse(match[1]));
        } catch {}
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [postId, isNew, editor]);

  const generateSlug = () => {
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100);
    setForm((f) => ({ ...f, slug }));
  };

  const uploadFile = async (file: File, onSuccess: (url: string) => void) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    onSuccess(data.url);
    return data;
  };

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      await uploadFile(file, (url) => setForm((f) => ({ ...f, cover_image_url: url })));
    } catch { setError('Cover upload failed'); }
    finally { setUploadingCover(false); }
  };

  const handleAttachUpload = async (file: File) => {
    try {
      const data = await uploadFile(file, () => {});
      setAttachments((prev) => [...prev, { name: file.name, url: data.url, type: file.type }]);
    } catch { setError('File upload failed'); }
  };

  const handleInlineImage = async (file: File) => {
    try {
      await uploadFile(file, (url) => {
        editor?.chain().focus().setImage({ src: url, alt: file.name }).run();
      });
    } catch { setError('Image upload failed'); }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    setSaving(true);
    setError('');
    setSuccess('');

    let content = editor.getHTML();
    if (attachments.length > 0) content += `<!--ATT:${JSON.stringify(attachments)}-->`;

    const payload = { ...form, content };
    const url = isNew ? '/api/admin/articles' : `/api/admin/article/${postId}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSuccess('Saved!');
      if (isNew && data.id) router.push(`/admin/posts/${data.id}`);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/posts" style={{ color: 'var(--text2)', fontSize: '.9rem' }}>← Posts</Link>
        <h1 style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: '1.8rem' }}>
          {isNew ? '✨ New Post' : '✏️ Edit Post'}
        </h1>
      </div>

      <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Title */}
        <div>
          <label>Title *</label>
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Your post title" required maxLength={255} />
        </div>

        {/* Slug */}
        <div>
          <label>Slug *</label>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="post-url-slug" required />
            <button type="button" className="btn btn-outline" onClick={generateSlug} style={{ flexShrink: 0 }}>Auto</button>
          </div>
          <p style={{ fontSize: '.8rem', color: 'var(--text2)', marginTop: '.3rem' }}>URL: /article/{form.slug || 'your-slug'}</p>
        </div>

        {/* Summary */}
        <div>
          <label>Summary</label>
          <input value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} placeholder="Short description shown on article cards" maxLength={500} />
        </div>

        {/* Category + Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              <option value="">No category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label>Cover Image</label>
          <div
            onClick={() => coverRef.current?.click()}
            style={{ border: '2px dashed var(--border)', borderRadius: '8px', cursor: 'pointer', overflow: 'hidden', minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
          >
            {form.cover_image_url ? (
              <img src={form.cover_image_url} alt="Cover" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '2rem' }}>
                {uploadingCover ? <><div className="spinner" style={{ margin: '0 auto .5rem' }} /><p>Uploading...</p></> : <><p style={{ fontSize: '1.5rem' }}>🖼</p><p style={{ fontSize: '.9rem' }}>Click to upload cover image</p><p style={{ fontSize: '.75rem' }}>PNG, JPG, WebP</p></>}
              </div>
            )}
          </div>
          <input value={form.cover_image_url} onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))} placeholder="Or paste image URL here" style={{ marginTop: '.5rem' }} />
          <input ref={coverRef} type="file" accept="image/*" className="hidden" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }} />
        </div>

        {/* Rich text content */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.4rem' }}>
            <label style={{ margin: 0 }}>Content *</label>
            <button type="button" className="btn btn-outline" onClick={() => inlineImageRef.current?.click()} style={{ fontSize: '.8rem', padding: '.3rem .7rem' }}>
              + Insert Image
            </button>
          </div>
          <div style={{ border: '1.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            <Toolbar editor={editor} onImageUpload={() => inlineImageRef.current?.click()} />
            <EditorContent editor={editor} />
          </div>
          <input ref={inlineImageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleInlineImage(f); }} />
        </div>

        {/* Attachments */}
        <div>
          <label>Attachments (PDFs, docs, files)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {attachments.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.6rem .9rem', background: 'var(--bg2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span>{a.type.includes('pdf') ? '📄' : a.type.includes('image') ? '🖼' : '📎'}</span>
                <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, color: 'var(--accent2)', fontSize: '.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</a>
                <button type="button" onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
              </div>
            ))}
            <button type="button" className="btn btn-outline" onClick={() => attachRef.current?.click()} style={{ alignSelf: 'flex-start', fontSize: '.9rem' }}>
              📎 Upload file / PDF
            </button>
            <input ref={attachRef} type="file" accept=".pdf,.doc,.docx,.txt,image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAttachUpload(f); }} />
          </div>
        </div>

        {/* Status messages */}
        {error && <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: '8px', padding: '.75rem 1rem', color: '#f87171' }}>❌ {error}</div>}
        {success && <div style={{ background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', borderRadius: '8px', padding: '.75rem 1rem', color: '#4ade80' }}>✅ {success}</div>}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', paddingBottom: '2rem' }}>
          <Link href="/admin/posts" className="btn btn-outline">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isNew ? '✨ Create Post' : '💾 Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
