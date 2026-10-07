import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import site from '../data/site';
import {
  calcEstimate,
  isQuantityOutOfRange,
  money,
  todayISO,
} from '../utils/pricing';
import { openWhatsApp } from '../utils/whatsapp';

const TIMES = [
  'Morning · 9 AM–12 PM',
  'Afternoon · 12–4 PM',
  'Evening · 4–8 PM',
  'Discuss another time',
];

export default function BookingForm() {
  const [params] = useSearchParams();
  const chosen = site.rates.find((rate) => rate.id === params.get('package'));

  const [segment, setSegment] = useState(
    chosen?.segment || 'Residential',
  );
  const [service, setService] = useState(
    chosen?.service ||
      (site.services.includes(params.get('service'))
        ? params.get('service')
        : site.services[0]),
  );
  const [packageId, setPackageId] = useState(chosen?.id || '');
  const [quantity, setQuantity] = useState(chosen?.quantity || 1);
  const [plan, setPlan] = useState(params.get('plan') === 'amc' ? 'amc' : 'one');
  const [city, setCity] = useState(
    site.cities.includes(params.get('city'))
      ? params.get('city')
      : site.cities[0],
  );
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusUrl, setStatusUrl] = useState('');

  const matching = useMemo(
    () =>
      site.rates.filter(
        (rate) => rate.segment === segment && rate.service === service,
      ),
    [segment, service],
  );

  const current =
    matching.find((rate) => rate.id === packageId) || matching[0] || null;

  const activeQuantity =
    current && packageId === current.id ? quantity : current?.quantity || 1;

  const estimate = current
    ? calcEstimate(current, activeQuantity, plan)
    : null;
  const rangeInvalid = current
    ? isQuantityOutOfRange(current, activeQuantity) ||
      (plan === 'amc' && Number(activeQuantity) !== current.quantity)
    : false;

  function selectFirstPackage(nextMatching) {
    const first = nextMatching[0];
    if (!first) return;
    setPackageId(first.id);
    setQuantity(first.quantity);
  }

  function onSegmentChange(value) {
    setSegment(value);
    const next = site.rates.filter(
      (rate) => rate.segment === value && rate.service === service,
    );
    selectFirstPackage(next);
  }

  function onServiceChange(value) {
    setService(value);
    const next = site.rates.filter(
      (rate) => rate.segment === segment && rate.service === value,
    );
    selectFirstPackage(next);
  }

  function onPackageChange(id) {
    const rate = matching.find((item) => item.id === id);
    setPackageId(id);
    if (rate) setQuantity(rate.quantity);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!current || !estimate || rangeInvalid) return;
    const form = new FormData(event.currentTarget);
    const message = [
      'Hello Deepcleaning99, I would like to request a cleaning booking.',
      `Name: ${form.get('name')}`,
      `Mobile: ${form.get('phone')}`,
      `Property: ${segment}`,
      `Service: ${service}`,
      `Package: ${current.package}`,
      `Quantity: ${activeQuantity} ${current.unit}`,
      `Plan: ${plan === 'amc' ? 'AMC / scheduled cleaning' : 'One-time · 30% launch offer'}`,
      `Service estimate (excluding applicable GST): ${money(estimate.total)}`,
      plan === 'amc' && estimate.amc
        ? `Plan: ${estimate.amc.visits} visits/year, ${money(estimate.amc.perVisit)} per visit`
        : '',
      `City: ${form.get('city')}`,
      `Area: ${form.get('area')}`,
      `Address: ${form.get('address')}`,
      `Preferred appointment: ${form.get('date')} · ${form.get('time')}`,
      form.get('notes') ? `Notes: ${form.get('notes')}` : '',
      'Please confirm the final scope, tax-inclusive quote and appointment availability.',
    ]
      .filter(Boolean)
      .join('\n');

    const url = openWhatsApp(message);
    setStatus(
      'Your request is ready. Tap Send in WhatsApp to deliver it. The team will confirm the appointment.',
    );
    setStatusUrl(url);
  }

  return (
    <section className="section wrap booking-layout">
      <form className="booking-form" onSubmit={handleSubmit}>
        <h2>1. Choose your cleaning</h2>
        <div className="form-grid">
          <label>
            Property type
            <select
              name="segment"
              value={segment}
              onChange={(event) => onSegmentChange(event.target.value)}
            >
              <option>Residential</option>
              <option>Commercial</option>
            </select>
          </label>
          <label>
            Service
            <select
              name="service"
              value={service}
              onChange={(event) => onServiceChange(event.target.value)}
            >
              {site.services.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="wide">
            Package
            <select
              name="package"
              value={current?.id || ''}
              onChange={(event) => onPackageChange(event.target.value)}
            >
              {matching.map((rate) => (
                <option key={rate.id} value={rate.id}>
                  {rate.package}
                </option>
              ))}
            </select>
          </label>
          <label>
            {current?.unit === 'sq ft'
              ? 'Area (sq ft)'
              : `Quantity (${current?.unit || 'unit'})`}
            <input
              name="quantity"
              type="number"
              min="1"
              step={current?.unit === 'sq ft' ? '0.01' : '1'}
              value={activeQuantity}
              readOnly={current?.unit === 'package'}
              onChange={(event) => {
                setPackageId(current?.id || '');
                setQuantity(event.target.value);
              }}
              required
            />
          </label>
          <label>
            Cleaning plan
            <select
              name="plan"
              value={plan}
              onChange={(event) => setPlan(event.target.value)}
            >
              <option value="one">One-time · 30% off</option>
              <option value="amc">Scheduled cleaning / AMC</option>
            </select>
          </label>
        </div>

        {current ? (
          <div className="scope-box">
            <strong>Package scope</strong>
            <p>{current.note}</p>
            <small>
              Typical team: {current.team}{' '}
              {current.team > 1 ? 'technicians' : 'technician'} · estimated
              on-site time: {current.hours} hours. Actual staffing depends on
              scope.
            </small>
          </div>
        ) : null}

        <h2>2. Your details</h2>
        <div className="form-grid">
          <label>
            Full name
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
          <label>
            Mobile number
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              pattern="(?:\+91[ -]?)?[6-9][0-9]{9}"
              placeholder="10-digit Indian mobile"
              required
            />
          </label>
          <label>
            City
            <select
              name="city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            >
              {site.cities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Area / locality
            <input
              name="area"
              autoComplete="address-level3"
              required
              maxLength={150}
            />
          </label>
          <label className="wide">
            Address
            <input
              name="address"
              autoComplete="street-address"
              required
              maxLength={300}
            />
          </label>
          <label>
            Preferred date
            <input name="date" type="date" min={todayISO()} required />
          </label>
          <label>
            Preferred time
            <select name="time" defaultValue={TIMES[0]}>
              {TIMES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="wide">
            Anything we should know? <small>(optional)</small>
            <textarea
              name="notes"
              rows={3}
              maxLength={600}
              placeholder="Material, stains, extra areas or access instructions"
            />
          </label>
        </div>

        <label className="check">
          <input
            type="checkbox"
            name="consent"
            required
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          <span>
            I agree to the <Link to="/booking-terms/">booking terms</Link> and{' '}
            <Link to="/privacy-notice/">privacy notice</Link>, and allow the
            team to contact me about this request.
          </span>
        </label>

        <button className="button full" type="submit" disabled={!current || rangeInvalid}>
          Send booking request on WhatsApp
        </button>
        <p className="fine">
          WhatsApp opens with your details. Tap Send there to deliver your
          request. An appointment is confirmed only after our team verifies the
          scope, final price and slot.
        </p>
        {rangeInvalid ? (
          <p className="form-error" role="alert">
            {plan === 'amc'
              ? `This AMC price is for ${current.quantity} ${current.unit}. Restore that quantity or call for a custom plan.`
              : 'This area is outside the selected package range. Choose the correct package or ask for a custom quote.'}
          </p>
        ) : null}
        {status ? (
          <div id="booking-status" role="status" aria-live="polite">
            {status}{' '}
            {statusUrl ? (
              <a
                className="text-link"
                href={statusUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open WhatsApp request
              </a>
            ) : null}
          </div>
        ) : null}
      </form>

      <aside className="summary">
        <span className="eyebrow">YOUR BOOKING ESTIMATE</span>
        <h2>{current?.package || 'Cleaning package'}</h2>
        {estimate && current ? (
          <dl>
            <div>
              <dt>Regular service charge</dt>
              <dd>
                {money(
                  estimate.scheduled
                    ? current.base * estimate.amc.visits
                    : estimate.base,
                )}
              </dd>
            </div>
            {!estimate.scheduled ? (
              <div>
                <dt>Launch discount · 30%</dt>
                <dd>−{money(estimate.saving)}</dd>
              </div>
            ) : null}
            <div className="total">
              <dt>
                {estimate.scheduled
                  ? 'Annual service estimate'
                  : 'Service estimate'}
              </dt>
              <dd>{money(estimate.total)}</dd>
            </div>
          </dl>
        ) : null}
        <p>
          {estimate?.scheduled && estimate.amc
            ? `${estimate.amc.visits} visits / year · ${money(estimate.amc.perVisit)} per visit · ${estimate.amc.interval}. AMC discount already included; launch offer does not combine.`
            : ''}
        </p>
        <p className="fine">
          Excluding applicable GST. Final tax-inclusive quote is confirmed by
          our team before the appointment.
        </p>
        <div className="summary-note">
          <strong>Equipment included</strong>
          <p>
            The cleaning team brings equipment and products for the agreed work.
          </p>
        </div>
        <p className="fine">
          Survey-based jobs and quantities outside the package scope need a
          quotation. Permanent stains and surface damage may remain after
          cleaning.
        </p>
        <a href={`tel:+91${site.phone}`}>Need help? Call {site.phone}</a>
      </aside>
    </section>
  );
}
