import { Link } from 'react-router-dom';
import site from '../data/site';

export default function MobileBar() {
  return (
    <div className="mobile-bar" aria-label="Quick actions">
      <a href={`tel:+91${site.phone}`}>Call</a>
      <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
      <Link to="/book-cleaning/">Book</Link>
    </div>
  );
}
