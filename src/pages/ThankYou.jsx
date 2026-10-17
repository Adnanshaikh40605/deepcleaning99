import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import site from '../data/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { money } from '../utils/pricing';
import { readThankYou } from '../utils/thankYou';
import { whatsappUrl } from '../utils/whatsapp';

function formatDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value || '';
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function bookingFromLocation(state) {
  if (state && typeof state === 'object' && (state.name || state.service || state.address)) {
    return state;
  }
  return readThankYou();
}

export default function ThankYou() {
  const { state } = useLocation();
  const booking = bookingFromLocation(state);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (typeof window.gtag !== 'function') return;
      window.gtag('event', 'conversion', {
        send_to: 'AW-18510797167/G_sFCNSh4Z4dEO-y0fpE',
        value: 1.0,
        currency: 'INR',
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useDocumentMeta({
    title: 'Thank you | Deepcleaning99',
    description:
      'Your Deepcleaning99 booking request is saved. Our team will call you to confirm the visit.',
    path: '/thank-you/',
  });

  const rows = booking
    ? [
        ['Service', booking.service],
        ['Package', booking.packageName],
        ['Address', booking.address],
        ['City', booking.city],
        ['Date', formatDate(booking.preferredDate)],
        ['Time', booking.preferredTime],
        ['Estimate', booking.price ? `${money(booking.price)} · GST extra` : ''],
      ].filter(([, value]) => value)
    : [];

  const whatsappMessage = booking?.name
    ? `Hi, I just booked a cleaning. My name is ${booking.name}.`
    : 'Hi, I just sent a cleaning booking request.';

  return (
    <section className="thanks-page">
      <div className="thanks-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="m6 12.5 4 4 8-9" />
        </svg>
      </div>
      <p className="thanks-kicker">Booking received</p>
      <h1>{booking?.name ? `Thank you, ${booking.name}` : 'Thank you'}</h1>
      <p className="thanks-lead">
        Your booking request is saved. Keep your phone nearby — our team will call you to
        confirm the visit, price and time.
      </p>

      {rows.length ? (
        <dl className="thanks-card">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="thanks-note">
          If you just sent a request, we already have it. We confirm every visit before the
          team arrives.
        </p>
      )}

      <div className="thanks-actions">
        <a className="button" href={`tel:+91${site.phone}`}>
          Call {site.phone}
        </a>
        <a className="button outline" href={whatsappUrl(whatsappMessage)} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        <Link className="button outline" to="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}
