import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Brand from './Brand';
import site from '../data/site';

const links = [
  { to: '/', label: 'Home' },
  { to: '/#services', label: 'Services', hash: true },
  { to: '/residential-deep-cleaning/', label: 'Residential' },
  { to: '/commercial-deep-cleaning/', label: 'Commercial' },
  { to: '/prices/', label: 'Prices' },
  { to: '/about-us/', label: 'About' },
  { to: '/contact-us/', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Brand />
        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? '✕' : '☰'}
        </button>
        <nav className={open ? 'open' : undefined} aria-label="Main navigation">
          {links.map((link) =>
            link.hash ? (
              <Link key={link.to} to={link.to} onClick={closeMenu}>
                {link.label}
              </Link>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                end={link.to === '/'}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                {link.label}
              </NavLink>
            ),
          )}
          <a className="button small call-button" href={`tel:+91${site.phone}`}>
            Call <span>24×7</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
