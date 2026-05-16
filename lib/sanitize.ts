import createDOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(dirty: string): string {
  return createDOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p','br','strong','em','u','s','h1','h2','h3','h4','h5','h6',
      'ul','ol','li','blockquote','code','pre','a','img','figure',
      'figcaption','hr','span',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}

export function sanitizeText(input: string): string {
  return createDOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}
