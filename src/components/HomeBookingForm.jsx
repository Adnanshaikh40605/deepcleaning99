import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import site from '../data/site';
import {
  calcOneTime,
  findFullHomePackage,
  isQuantityOutOfRange,
  money,
  ratesForService,
  todayISO,
} from '../utils/pricing';
import { openWhatsApp } from '../utils/whatsapp';

const SIZES = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK'];
const TYPES = ['Furnished', 'Empty'];
const TIMES = [
  '9 AM – 12 PM',
  '12 PM – 4 PM',
  '4 PM – 8 PM',
  'Discuss another time',
];

export default function HomeBookingForm() {
  const [service, setService] = useState(site.services[0]);
  const [size, setSize] = useState('1BHK');
  const [type, setType] = useState('Furnished');
  const [packageId, setPackageId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [city, setCity] = useState(site.cities[0]);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusUrl, setStatusUrl] = useState('');

  const isFullHome = service === 'Full Home Deep Cleaning';

  const packages = useMemo(() => {
    if (isFullHome) return [];
    const segment =
      service === 'Office Deep Cleaning' ? 'Commercial' : 'Residential';
    return ratesForService(service, segment);
  }, [service, isFullHome]);

  const current = useMemo(() => {
    if (isFullHome) return findFullHomePackage(size, type) ?? null;
    const selected =
      packages.find((rate) => rate.id === packageId) || packages[0] || null;
    return selected;
  }, [isFullHome, size, type, packages, packageId]);

  const pricing = current ? calcOneTime(current, quantity) : null;
  const invalid =
    current && isQuantityOutOfRange(current, quantity);

  function handleServiceChange(next) {
    setService(next);
    setStatus(null);
    if (next === 'Full Home Deep Cleaning') return;
    const segment =
      next === 'Office Deep Cleaning' ? 'Commercial' : 'Residential';
    const matching = ratesForService(next, segment);
    const first = matching[0];
    if (first) {
      setPackageId(first.id);
      setQuantity(first.quantity);
    }
  }

  function handlePackageChange(id) {
    const rate = packages.find((item) => item.id === id);
    setPackageId(id);
    if (rate) {
      setQuantity(rate.quantity);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!current || !pricing || invalid) return;
    const form = new FormData(event.currentTarget);
    const message = [
      'Hello Deepcleaning99, please confirm my cleaning booking request.',
      `Name: ${form.get('name')}`,
      `Mobile: ${form.get('phone')}`,
      `Service: ${service}`,
      `Package: ${current.package}`,
      `Quantity: ${quantity} ${current.unit}`,
      `Regular service charge: ${money(pricing.base)}`,
      `30% launch discount: ${money(pricing.saving)}`,
      `Service estimate (GST extra): ${money(pricing.total)}`,
      `City: ${city}`,
      `Locality / Pincode: ${form.get('area')}`,
      `Address: ${form.get('address')}`,
      `Preferred date: ${form.get('date')}`,
      `Preferred time: ${form.get('time')}`,
      'Please confirm the scope, final tax-inclusive price and available appointment.',
    ].join('\n');

    const url = openWhatsApp(message);
    setStatus(
      'Your request is ready. Tap Send in WhatsApp; our team will confirm the appointment.',
    );
    setStatusUrl(url);
  }

  return (
    <form id="home-booking" className="home-booking" onSubmit={handleSubmit}>
      <h2>Book Your Cleaning</h2>

      <label>
        Service
        <select
          name="service"
          value={service}
          onChange={(event) => handleServiceChange(event.target.value)}
        >
          {site.services.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      {isFullHome ? (
        <div id="home-property">
          <span className="field-label">Property Size</span>
          <div className="chip-group size-chips" role="group" aria-label="Property size">
            {SIZES.map((item) => (
              <button
                key={item}
                type="button"
                className={size === item ? 'selected' : undefined}
                aria-pressed={size === item}
                onClick={() => setSize(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <span className="field-label">Property Type</span>
          <div className="chip-group type-chips" role="group" aria-label="Property type">
            {TYPES.map((item) => (
              <button
                key={item}
                type="button"
                className={type === item ? 'selected' : undefined}
                aria-pressed={type === item}
                onClick={() => setType(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div id="home-package-fields">
          <label>
            Package
            <select
              value={current?.id || ''}
              onChange={(event) => handlePackageChange(event.target.value)}
            >
              {packages.map((rate) => (
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
              type="number"
              min="1"
              step={current?.unit === 'sq ft' ? '0.01' : '1'}
              value={quantity}
              readOnly={current?.unit === 'package'}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />
          </label>
        </div>
      )}

      <div className="home-form-grid">
        <label>
          City
          <select
            name="city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          >
            {site.cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          Locality / Pincode
          <input
            name="area"
            placeholder="Enter locality or pincode"
            required
            maxLength={120}
          />
        </label>
        <label className="wide">
          Complete Address
          <input
            name="address"
            placeholder="Enter complete address"
            required
            maxLength={300}
            autoComplete="street-address"
          />
        </label>
        <label>
          Preferred Date
          <input name="date" type="date" min={todayISO()} required />
        </label>
        <label>
          Preferred Time
          <select name="time" defaultValue={TIMES[0]}>
            {TIMES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Name
          <input
            name="name"
            placeholder="Enter your name"
            autoComplete="name"
            required
            maxLength={100}
          />
        </label>
        <label>
          Mobile Number
          <input
            name="phone"
            placeholder="10-digit mobile number"
            type="tel"
            inputMode="tel"
            pattern="(?:\+91[ -]?)?[6-9][0-9]{9}"
            autoComplete="tel"
            required
          />
        </label>
      </div>

      {pricing && current ? (
        <>
          <div className="home-price-strip">
            <div>
              <small>Regular Price</small>
              <del>{money(pricing.base)}</del>
            </div>
            <div>
              <small>Your Price</small>
              <strong>{money(pricing.total)}</strong>
            </div>
            <div className="home-savings">
              <span className="offer">30% OFF</span>
              <small>
                You Save <b>{money(pricing.saving)}</b>
              </small>
            </div>
            <span className="gst-extra">
              GST extra · final quote confirmed by our team
            </span>
          </div>
          <p className="home-scope">
            {current.note} · {current.team}{' '}
            {current.team > 1 ? 'technicians' : 'technician'}
          </p>
        </>
      ) : null}

      <label className="home-consent">
        <input
          name="consent"
          type="checkbox"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>
          I agree to the <Link to="/booking-terms/">booking terms</Link> and{' '}
          <Link to="/privacy-notice/">privacy notice</Link>.
        </span>
      </label>

      <button className="button full" type="submit" disabled={!current || invalid}>
        Confirm Booking
      </button>
      <small className="home-booking-note">
        Send your request on WhatsApp. Our team confirms the final price and
        appointment.
      </small>
      {invalid ? (
        <p className="form-error" role="alert">
          Choose the package for your actual area, or call for a custom quote.
        </p>
      ) : null}
      {status ? (
        <div className="home-status" role="status" aria-live="polite">
          {status}{' '}
          {statusUrl ? (
            <a
              className="text-link"
              href={statusUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open WhatsApp
            </a>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
