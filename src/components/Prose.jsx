import { useNavigate } from 'react-router-dom';

function normalizeHtml(html) {
  if (!html) return '';
  return html
    .replace(/<p>Buttons:.*?<\/p>/gi, '')
    .replace(
      /href="(\/[a-z0-9\-./]+)"/gi,
      'href="$1" data-internal="true"',
    );
}

export default function Prose({ html, className = 'prose' }) {
  const navigate = useNavigate();
  const cleaned = normalizeHtml(html);

  if (!cleaned) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: cleaned }}
      onClick={(event) => {
        const anchor = event.target.closest('a[data-internal="true"]');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) {
          return;
        }
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}
