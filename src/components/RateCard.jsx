import { Link } from 'react-router-dom';
import { calcEstimate, findAmc, money } from '../utils/pricing';

export default function RateCard({ rate, plan = 'one' }) {
  const amc = findAmc(rate.id);
  const scheduled = plan === 'amc';
  if (scheduled && !amc) return null;

  const estimate = calcEstimate(rate, rate.quantity, plan);

  return (
    <article className="rate-card">
      <span className="eyebrow">{rate.service}</span>
      <h3>{rate.package}</h3>
      {scheduled ? (
        <span className="offer">{amc.visits} VISITS / YEAR</span>
      ) : (
        <div>
          <del>{money(rate.base)}</del> <span className="offer">30% OFF</span>
        </div>
      )}
      <strong className="big-price">{money(estimate.total)}</strong>
      <p>
        {scheduled
          ? `${money(amc.perVisit)} per visit · ${amc.interval}`
          : `${rate.quantity} ${rate.unit}${rate.quantity > 1 && !rate.unit.endsWith('ft') && rate.unit !== 'package' ? 's' : ''} · ${rate.team} ${rate.team > 1 ? 'technicians' : 'technician'} · ${rate.hours} hours`}
      </p>
      <p className="note">{rate.note}</p>
      <small>
        Excluding applicable GST{scheduled ? ' · annual plan' : ''}
      </small>
      <Link
        className="button full"
        to={`/book-cleaning/?package=${encodeURIComponent(rate.id)}&plan=${scheduled ? 'amc' : 'one'}`}
      >
        {scheduled ? 'Request AMC plan' : 'Book this package'}
      </Link>
    </article>
  );
}
