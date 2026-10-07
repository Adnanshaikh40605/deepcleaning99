import { useEffect } from 'react';

export function useDocumentMeta({ title, description, path = '/' }) {
  useEffect(() => {
    if (title) document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    if (description) meta.setAttribute('content', description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const cleanPath = path.endsWith('/') || path.includes('.') ? path : `${path}/`;
    canonical.setAttribute('href', `https://deepcleaning99.com${cleanPath === '/' ? '/' : cleanPath}`);
  }, [title, description, path]);
}
