import PageHero from '../components/PageHero';
import site from '../data/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { Link } from 'react-router-dom';

export default function Contact() {
  useDocumentMeta({
    title: 'Contact Deepcleaning99 | 24×7 Call & WhatsApp',
    description:
      'Call or WhatsApp 7710082627 for cleaning bookings, commercial quotes and service enquiries.',
    path: '/contact-us/',
  });

  return (
    <>
      <PageHero
        eyebrow="24×7 CUSTOMER SUPPORT"
        title="Tell us what needs cleaning."
        description="For home bookings, commercial quotes or help with an existing visit."
      />
      <section className="section wrap contact-grid">
        <article className="info-card">
          <h2>Call the team</h2>
          <p>Discuss your property, service scope and available appointment.</p>
          <a className="button" href={`tel:+91${site.phone}`}>
            {site.phone}
          </a>
        </article>
        <article className="info-card">
          <h2>WhatsApp us</h2>
          <p>
            Send your floor area, item quantities and photographs for a clearer
            quote.
          </p>
          <a
            className="button"
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open WhatsApp
          </a>
        </article>
        <article className="info-card">
          <h2>Service areas</h2>
          <p>{site.cities.join(', ')}.</p>
          <small>
            24×7 support. Cleaning visits depend on appointment availability.
          </small>
          <p style={{ marginTop: 16 }}>
            <Link className="text-link" to="/book-cleaning/">
              Or book online
            </Link>
          </p>
        </article>
      </section>
    </>
  );
}
