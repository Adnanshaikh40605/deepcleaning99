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
        </nav>
        <div className="header-tools">
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
          <a className="header-call" href={`tel:+91${site.phone}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 3.5h3.2l1.2 3.1-1.8 1.1a12.5 12.5 0 0 0 5.7 5.7l1.1-1.8 3.1 1.2V16a2.5 2.5 0 0 1-2.5 2.5A14.5 14.5 0 0 1 4.5 6 2.5 2.5 0 0 1 7 3.5Z" />
            </svg>
            Call
          </a>
          <a
            className="header-wa"
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3.5A8.5 8.5 0 0 0 5.2 16.7L4 20.5l3.9-1.2A8.5 8.5 0 1 0 12 3.5Zm4.6 11.9c-.2.5-1.1.9-1.5 1-.4.1-.9.1-1.4-.1-.3-.1-.7-.2-1.2-.5-2.1-1.1-3.5-3.1-3.6-3.3-.1-.2-.9-1.2-.9-2.3s.6-1.6.8-1.8c.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .5.4.2.5.6 1.6.7 1.7.1.1.1.3 0 .4l-.3.4c-.1.1-.2.3-.1.5.2.3.7 1.1 1.4 1.8.9.8 1.7 1.1 2 .1.1-.2.3-.3.5-.2l1.2.6c.2.1.4.2.4.3.1.2.1.8-.1 1.3Z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
