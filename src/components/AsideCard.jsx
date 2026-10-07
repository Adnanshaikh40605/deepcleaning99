import { Link } from 'react-router-dom';
import site from '../data/site';

export default function AsideCard({
  title = 'A clear quote. A suitable slot.',
  text = 'Share your property size, photographs and preferred appointment.',
}) {
  return (
    <aside className="aside-card">
      <span className="eyebrow">LET’S PLAN YOUR VISIT</span>
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="button full" to="/book-cleaning/">
        Check prices & book
      </Link>
      <a
        className="button outline full"
        href={`https://wa.me/${site.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp the team
      </a>
      <small>24×7 customer support</small>
    </aside>
  );
}
