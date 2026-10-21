import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCatalog } from '../catalog';
import {
  calcEstimate,
  isQuantityOutOfRange,
  money,
  todayISO,
} from '../utils/pricing';
import { digitsOnlyPhone, isValidBookingMobile } from '../utils/api';
import { useDeepCleaningSilentLead } from '../utils/useSilentLead';
import { goToThankYou } from '../utils/thankYou';
import { cityFromAddress } from '../utils/googleMaps';
import AddressAutocomplete from './AddressAutocomplete';

const TIMES = [
  'Morning · 9 AM–12 PM',
  'Afternoon · 12–4 PM',
  'Evening · 4–8 PM',
  'Discuss another time',
];

export default function BookingForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const site = useCatalog();
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState(TIMES[0]);
  const [notes, setNotes] = useState('');

  const matching = useMemo(
    () =>
      site.rates.filter(
        (rate) => rate.segment === segment && rate.service === service,
      ),
    [site, segment, service],
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
  const matchedCity = cityFromAddress(address, site.cities) || city;
  const leadSnapshot = useMemo(
    () => ({
      name: name.trim(),
      mobile: phone,
      city: matchedCity,
      address: address.trim(),
      segment,
      service,
      package_name: current?.package || '',
      package_id: current?.id || '',
      quantity: String(activeQuantity),
      unit: current?.unit || '',
      plan: plan === 'amc' ? 'amc' : 'one',
      preferred_date: date,
      preferred_time: time,
      estimated_price: estimate?.total ?? null,
      regular_price: estimate
        ? estimate.scheduled
          ? current.base * (estimate.amc?.visits || 1)
          : estimate.base
        : null,
      discount_amount: 0,
      notes: notes.trim(),
      page_url: typeof window !== 'undefined' ? window.location.href : '',
    }),
    [
      name,
      phone,
      matchedCity,
      address,
      segment,
      service,
      current,
      activeQuantity,
      plan,
      date,
      time,
      estimate,
      notes,
    ],
  );
  const { flush } = useDeepCleaningSilentLead(leadSnapshot);

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

  async function handleSubmit(event) {
    event.preventDefault();
    if (!current || !estimate || rangeInvalid || submitting) return;
    if (name.trim().length < 2 || !isValidBookingMobile(phone) || address.trim().length < 5 || !date) {
      setError('Enter your full address, date, name and a 10-digit mobile number.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await flush();

      goToThankYou(navigate, {
        name: name.trim(),
        service,
        packageName: current.package,
        city: matchedCity,
        address: address.trim(),
        preferredDate: date,
        preferredTime: time,
        price: estimate.total,
      });
    } catch (err) {
      setError(err?.message || 'Could not submit booking request. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
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
              value={phone}
              onChange={(event) => setPhone(digitsOnlyPhone(event.target.value).slice(0, 10))}
            />
          </label>
          <label className="wide">
            Address
            <AddressAutocomplete
              name="address"
              placeholder="Start typing your address"
              required
              maxLength={300}
              onChange={(value) => {
                setAddress(value);
                const match = cityFromAddress(value, site.cities);
                if (match) setCity(match);
              }}
              onSelect={(value) => {
                const match = cityFromAddress(value, site.cities);
                if (match) setCity(match);
              }}
            />
          </label>
          <label>
            Date
            <input
              name="date"
              type="date"
              min={todayISO()}
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <label>
            Time
            <select name="time" value={time} onChange={(event) => setTime(event.target.value)}>
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
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
        </div>

        <button
          className="button full"
          type="submit"
          disabled={!current || rangeInvalid || submitting}
        >
          {submitting ? 'Submitting…' : 'Confirm Booking'}
        </button>
        <p className="fine">
          Confirm Booking saves your request to our team. An appointment is
          confirmed only after we verify the scope, final price and slot.{' '}
          <Link to="/booking-terms/">Read the customer terms and conditions</Link>.
        </p>
        {rangeInvalid ? (
          <p className="form-error" role="alert">
            {plan === 'amc'
              ? `This AMC price is for ${current.quantity} ${current.unit}. Restore that quantity or call for a custom plan.`
              : 'This area is outside the selected package range. Choose the correct package or ask for a custom quote.'}
          </p>
        ) : null}
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
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
                <dt>Promotion</dt>
                <dd>30% OFF</dd>
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
