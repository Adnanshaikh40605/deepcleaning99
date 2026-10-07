import { Link } from 'react-router-dom';
import Brand from './Brand';
import site from '../data/site';

const YEAR = new Date().getFullYear();

const primary = [
  { to: '/#services', label: 'Services' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/contact-us/', label: 'Contact' },
];

const secondary = [
  { to: '/about-us/', label: 'About us' },
  { to: '/residential-deep-cleaning/', label: 'Residential' },
  { to: '/commercial-deep-cleaning/', label: 'Commercial' },
  { to: '/scheduled-cleaning/', label: 'AMC plans' },
  { to: '/faqs/', label: 'FAQs' },
  { to: '/guides/', label: 'Cleaning guides' },
  { to: '/booking-terms/', label: 'Booking terms' },
  { to: '/privacy-notice/', label: 'Privacy' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <Brand inverted compact />
        <div className="footer-primary">
          {primary.map((link, index) => (
            <span key={link.to}>
              {index > 0 ? <span className="footer-sep">|</span> : null}
              <Link to={link.to}>{link.label}</Link>
            </span>
          ))}
        </div>
        <p>
          A unit of Multi Pest Care LLP
          <br />© {YEAR} · All rights reserved.
        </p>
      </div>
      <div className="wrap footer-links">
        {secondary.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </div>
      <div className="wrap footer-cities">
        <span>{site.cities.join(' · ')}</span>
        <span>
          Call / WhatsApp:{' '}
          <a href={`tel:+91${site.phone}`}>{site.phone}</a> · 24×7 support
        </span>
      </div>
    </footer>
  );
}
