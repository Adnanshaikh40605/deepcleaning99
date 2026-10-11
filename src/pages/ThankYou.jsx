import { Link, useLocation } from 'react-router-dom';
import PageHero from '../components/PageHero';
import site from '../data/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { money } from '../utils/pricing';

function formatDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value || '';
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export default function ThankYou() {
  const { state } = useLocation();
  const booking = state && typeof state === 'object' ? state : null;

  useDocumentMeta({
    title: 'Booking request received | Deepcleaning99',
    description:
      'Your Deepcleaning99 cleaning request is saved. Our team will confirm the scope, price and appointment.',
    path: '/thank-you/',
  });

  const rows = booking
    ? [
        ['Service', booking.service],
        ['Package', booking.packageName],
        ['City', booking.city],
        ['Address', booking.address],
        ['Date', formatDate(booking.preferredDate)],
        ['Time', booking.preferredTime],
        ['Estimate', booking.price ? `${money(booking.price)} · GST extra` : ''],
      ].filter(([, value]) => value)
    : [];

  return (
    <>
      <PageHero
        eyebrow="BOOKING RECEIVED"
        title={booking?.name ? `Thank you, ${booking.name}` : 'Thank you'}
        description="Your booking request is saved. Our team will call you to confirm the scope, final price and appointment."
      />
      <section className="section wrap thanks">
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
            If you just sent a request, keep your phone nearby. We confirm every
            visit before the team arrives.
          </p>
        )}
        <div className="thanks-actions">
          <Link className="button" to="/">
            Back to home
          </Link>
          <a className="button outline" href={`tel:+91${site.phone}`}>
            Call {site.phone}
          </a>
        </div>
      </section>
    </>
  );
}
