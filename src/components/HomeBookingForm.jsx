import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../catalog';
import {
  calcOneTime,
  findFullHomePackage,
  isQuantityOutOfRange,
  money,
  ratesForService,
  todayISO,
} from '../utils/pricing';
import { digitsOnlyPhone, submitDeepCleaningInquiry } from '../utils/api';
import { cityFromAddress } from '../utils/googleMaps';
import AddressAutocomplete from './AddressAutocomplete';
import ChoiceSelect from './ChoiceSelect';

const SIZES = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK'];
const TYPES = ['Furnished', 'Empty'];
const TIMES = [
  '9 AM – 12 PM',
  '12 PM – 4 PM',
  '4 PM – 8 PM',
  'Discuss another time',
];

export default function HomeBookingForm() {
  const navigate = useNavigate();
  const site = useCatalog();
  const [services, setServices] = useState([site.services[0]]);
  const selectedServices = services.length ? services : [site.services[0]];
  const [size, setSize] = useState('1BHK');
  const [type, setType] = useState('Furnished');
  const [packageId, setPackageId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [city, setCity] = useState(site.cities[0]);
  const [time, setTime] = useState(TIMES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const includesFullHome = selectedServices.includes('Full Home Deep Cleaning');
  const singleService = selectedServices.length === 1 ? selectedServices[0] : '';
  const showPackage = singleService && singleService !== 'Full Home Deep Cleaning';

  const packages = useMemo(() => {
    if (!showPackage) return [];
    const segment =
      singleService === 'Office Deep Cleaning' ? 'Commercial' : 'Residential';
    return ratesForService(singleService, segment);
  }, [site, showPackage, singleService]);

  const lineItems = useMemo(() => {
    return selectedServices
      .map((name) => {
        if (name === 'Full Home Deep Cleaning') {
          const rate = findFullHomePackage(size, type);
          return rate ? { service: name, rate, quantity: 1 } : null;
        }
        const segment =
          name === 'Office Deep Cleaning' ? 'Commercial' : 'Residential';
        const list = ratesForService(name, segment);
        const rate =
          selectedServices.length === 1
            ? list.find((item) => item.id === packageId) || list[0]
            : list[0];
        return rate
          ? {
              service: name,
              rate,
              quantity: selectedServices.length === 1 ? quantity : rate.quantity,
            }
          : null;
      })
      .filter(Boolean);
  }, [site, selectedServices, size, type, packageId, quantity]);

  const current = lineItems.length === 1 ? lineItems[0].rate : null;

  const pricing = useMemo(() => {
    if (!lineItems.length) return null;
    return lineItems.reduce(
      (sum, item) => {
        const price = calcOneTime(item.rate, item.quantity);
        return {
          base: sum.base + price.base,
          saving: sum.saving + price.saving,
          total: sum.total + price.total,
        };
      },
      { base: 0, saving: 0, total: 0 },
    );
  }, [lineItems]);

  const invalid =
    lineItems.length === 1 &&
    isQuantityOutOfRange(lineItems[0].rate, lineItems[0].quantity);

  function handleServiceChange(next) {
    if (!next.length) return;
    setServices(next);
    if (next.length !== 1 || next[0] === 'Full Home Deep Cleaning') return;
    const segment =
      next[0] === 'Office Deep Cleaning' ? 'Commercial' : 'Residential';
    const matching = ratesForService(next[0], segment);
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

  async function handleSubmit(event) {
    event.preventDefault();
    if (!lineItems.length || !pricing || invalid || submitting) return;
    const form = new FormData(event.currentTarget);
    const phone = digitsOnlyPhone(form.get('phone'));
    const name = String(form.get('name') || '').trim();
    const address = String(form.get('address') || '').trim();
    const preferredDate = String(form.get('date') || '').trim();
    const preferredTime = String(form.get('time') || '').trim();

    if (!address || !preferredDate || !name || !/^[6-9]\d{9}$/.test(phone)) {
      setError('Please fill in your address, date, name and mobile number.');
      return;
    }

    setError(null);
    setSubmitting(true);

    const segment = selectedServices.includes('Office Deep Cleaning')
      ? 'Commercial'
      : 'Residential';
    const serviceLabel = selectedServices.join(', ');
    const packageLabel = lineItems.map((item) => item.rate.package).join(', ');

    try {
      await submitDeepCleaningInquiry({
        name,
        mobile: phone,
        city,
        address,
        segment,
        service: serviceLabel,
        package_name: packageLabel,
        package_id: lineItems.map((item) => item.rate.id).join(', '),
        quantity: lineItems.map((item) => item.quantity).join(', '),
        unit: lineItems.map((item) => item.rate.unit || '').join(', '),
        plan: 'one',
        property_size: includesFullHome ? size : '',
        property_type: includesFullHome ? type : '',
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        estimated_price: pricing.total,
        regular_price: pricing.base,
        discount_amount: pricing.saving,
        notes: '',
        page_url: typeof window !== 'undefined' ? window.location.href : '',
      });

      navigate('/thank-you/', {
        replace: true,
        state: {
          name,
          service: serviceLabel,
          packageName: packageLabel,
          city,
          address,
          preferredDate,
          preferredTime,
          price: pricing.total,
        },
      });
    } catch (err) {
      setError(err?.message || 'Could not submit booking request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form id="home-booking" className="home-booking" noValidate onSubmit={handleSubmit}>
      <h2>Book Your Cleaning</h2>

      <ChoiceSelect
        label="Service"
        name="service"
        multiple
        value={selectedServices}
        options={site.services}
        onChange={handleServiceChange}
      />

      {includesFullHome ? (
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
      ) : null}
      {showPackage ? (
        <div id="home-package-fields">
          <ChoiceSelect
            label="Package"
            value={current?.id || ''}
            options={packages.map((rate) => ({ value: rate.id, label: rate.package }))}
            onChange={handlePackageChange}
          />
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
      ) : null}

      <div className="home-form-grid">
        <label className="wide">
          Complete Address
          <AddressAutocomplete
            name="address"
            placeholder="Type your address"
            required
            maxLength={300}
            onSelect={(address) => {
              const match = cityFromAddress(address, site.cities);
              if (match) setCity(match);
            }}
          />
        </label>
        <label>
          Date
          <input name="date" type="date" min={todayISO()} required />
        </label>
        <ChoiceSelect
          label="Time"
          name="time"
          value={time}
          options={TIMES}
          onChange={setTime}
        />
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
            placeholder="10-digit number"
            type="tel"
            inputMode="tel"
            pattern="(?:\+91[ -]?)?[6-9][0-9]{9}"
            autoComplete="tel"
            required
          />
        </label>
      </div>

      {pricing && lineItems.length ? (
        <>
          <div className="home-price-strip">
            <div className="home-price-copy">
              <strong>
                {selectedServices.length > 1
                  ? `${selectedServices.length} services`
                  : includesFullHome
                    ? `${size} ${type === 'Furnished' ? 'Furnishing' : type}`
                    : current?.package}
              </strong>
              <small>Price (Excl. GST)</small>
              <div className="home-price-meta">
                <del>{money(pricing.base)}</del>
                <span className="offer">30% OFF</span>
              </div>
            </div>
            <b className="home-price-now">{money(pricing.total)}</b>
          </div>
          <p className="home-scope">
            {selectedServices.length > 1
              ? 'Combined estimate for the selected services. Final scope is confirmed by our team.'
              : `${current.note} · ${current.team} ${
                  current.team > 1 ? 'technicians' : 'technician'
                }`}
          </p>
        </>
      ) : null}

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="button full"
        type="submit"
        disabled={!lineItems.length || invalid || submitting}
      >
        {submitting ? 'Submitting…' : 'Confirm Booking'}
      </button>
      <small className="home-booking-note">
        Confirm Booking saves your request to our team. Final price and
        appointment are confirmed after review.
      </small>
      {invalid ? (
        <p className="form-error" role="alert">
          Choose the package for your actual area, or call for a custom quote.
        </p>
      ) : null}
    </form>
  );
}
