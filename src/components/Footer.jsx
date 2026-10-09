import { Link } from 'react-router-dom';
import Brand from './Brand';
import site from '../data/site';

const YEAR = new Date().getFullYear();

const primary = [
  { to: '/#services', label: 'Services' },
  { to: '/residential-deep-cleaning/', label: 'Residential' },
  { to: '/commercial-deep-cleaning/', label: 'Commercial' },
  { to: '/prices/', label: 'Prices' },
  { to: '/contact-us/', label: 'Contact' },
];

const areas = [
  { to: '/deep-cleaning-mumbai/', label: 'Mumbai' },
  { to: '/deep-cleaning-thane/', label: 'Thane' },
  { to: '/deep-cleaning-navi-mumbai/', label: 'Navi Mumbai' },
  { to: '/deep-cleaning-pune/', label: 'Pune' },
  { to: '/deep-cleaning-lonavala/', label: 'Lonavala' },
];

const secondary = [
  { to: '/booking-terms/', label: 'Booking terms' },
  { to: '/privacy-notice/', label: 'Privacy notice' },
  { to: '/service-quality/', label: 'Service quality' },
  { to: '/faqs/', label: 'FAQs' },
  { to: '/scheduled-cleaning/', label: 'Cleaning AMC' },
  { to: '/guides/', label: 'Cleaning guides' },
  { to: '/about-us/', label: 'About us' },
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
          Deepcleaning99.com provides residential and commercial deep cleaning.
          We are part of Pestcontrol99.com, under Multi Pest Care LLP.
          <br />© {YEAR} Multi Pest Care LLP. All rights reserved.
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
        <span>
          {areas.map((area, index) => (
            <span key={area.to}>
              {index > 0 ? ' · ' : null}
              <Link to={area.to}>{area.label}</Link>
            </span>
          ))}
        </span>
        <span>
          Call / WhatsApp:{' '}
          <a href={`tel:+91${site.phone}`}>{site.phone}</a> · 24×7 support
        </span>
      </div>
    </footer>
  );
}
