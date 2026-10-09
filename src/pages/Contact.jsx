import PageHero from '../components/PageHero';
import site from '../data/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { Link } from 'react-router-dom';

export default function Contact() {
  useDocumentMeta({
    title: 'Contact Deepcleaning99 for Cleaning Bookings and Quotes',
    description:
      'Contact Deepcleaning99 for residential cleaning bookings, commercial quotations and service enquiries across our five service cities.',
    path: '/contact-us/',
  });

  return (
    <>
      <PageHero
        eyebrow="DEEPCLEANING99"
        title="Tell us what needs cleaning"
        description="For home bookings, tell us the service, property size and location. For commercial work, add the floor area, photographs and preferred schedule."
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
            Multi Pest Care LLP · Deepcleaning99.com by Pestcontrol99.com.
            Call centre and WhatsApp support are available 24×7. Cleaning
            appointments depend on slot availability.
          </small>
          <p style={{ marginTop: 16 }}>
            <Link className="text-link" to="/book-cleaning/">
              Send my enquiry
            </Link>
            {' · '}
            <a className="text-link" href="https://pestcontrol99.com/">
              Pest control enquiries
            </a>
          </p>
        </article>
      </section>
    </>
  );
}
