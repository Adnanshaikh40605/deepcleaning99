import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCatalog } from '../catalog';
import {
  calcOneTime,
  findFullHomePackage,
  money,
  todayISO,
} from '../utils/pricing';
import { digitsOnlyPhone, submitDeepCleaningInquiry } from '../utils/api';
import { goToThankYou } from '../utils/thankYou';
import { cityFromAddress } from '../utils/googleMaps';
import AddressAutocomplete from './AddressAutocomplete';

const SIZES = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK'];
const TIMES = ['9 AM – 12 PM', '12 PM – 4 PM', '4 PM – 8 PM', 'Discuss another time'];

const CARDS = [
  { key: 'full', label: 'Full Home', service: 'Full Home Deep Cleaning', image: '/assets/services/banner/full-home.jpg' },
  { key: 'kitchen', label: 'Kitchen', service: 'Kitchen Deep Cleaning', image: '/assets/services/banner/kitchen.jpg' },
  { key: 'bathroom', label: 'Bathroom', service: 'Bathroom Deep Cleaning', image: '/assets/services/banner/bathroom.jpg' },
  { key: 'sofa', label: 'Sofa', service: 'Sofa Cleaning', image: '/assets/services/banner/sofa.jpg' },
  { key: 'mattress', label: 'Mattress', service: 'Mattress Cleaning', image: '/assets/services/banner/mattress.jpg' },
  { key: 'carpet', label: 'Carpet', service: 'Carpet Cleaning', image: '/assets/services/banner/carpet.jpg' },
];

const OFFICE_CARD = {
  key: 'office',
  label: 'Office',
  service: 'Office Deep Cleaning',
  image: '/assets/services/banner/office.jpg',
};

function sizeIndex(size) {
  return Math.max(0, SIZES.indexOf(size));
}

function chooseRate(catalog, segment, service, size, type) {
  const residential = segment !== 'Commercial';
  const pool = catalog.rates.filter(
    (rate) => rate.service === service && rate.segment === (residential ? 'Residential' : 'Commercial'),
  );
  const fallback = pool[0] || catalog.rates.find((rate) => rate.service === service) || null;
  const big = sizeIndex(size) >= 3;
  const mid = sizeIndex(size) === 2;
  const id = residential
    ? {
        'Full Home Deep Cleaning': null,
        'Kitchen Deep Cleaning': big ? 'R14' : type === 'Empty' ? 'R12' : 'R13',
        'Bathroom Deep Cleaning': big ? 'R17' : mid ? 'R16' : 'R15',
        'Sofa Cleaning': big ? 'R21' : mid ? 'R20' : 'R19',
        'Mattress Cleaning': size === '1RK' ? 'R24' : big ? 'R26' : 'R25',
        'Carpet Cleaning': sizeIndex(size) <= 1 ? 'R27' : 'R28',
        'Office Deep Cleaning': 'R29',
      }[service]
    : {
        'Full Home Deep Cleaning': 'C1',
        'Kitchen Deep Cleaning': big ? 'C4' : mid ? 'C3' : 'C2',
        'Bathroom Deep Cleaning': big ? 'C6' : 'C5',
        'Sofa Cleaning': 'C7',
        'Mattress Cleaning': big || mid ? 'C10' : 'C9',
        'Carpet Cleaning': big ? 'C13' : mid ? 'C12' : 'C11',
        'Office Deep Cleaning': ['C14', 'C14', 'C15', 'C16', 'C17'][sizeIndex(size)],
      }[service];

  if (residential && service === 'Full Home Deep Cleaning') {
    return findFullHomePackage(size, type) || fallback;
  }
  return (id && catalog.rates.find((rate) => rate.id === id)) || fallback;
}

function Icon({ name }) {
  const common = { viewBox: '0 0 24 24', 'aria-hidden': true };
  if (name === 'home') {
    return (
      <svg {...common}>
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
      </svg>
    );
  }
  if (name === 'building') {
    return (
      <svg {...common}>
        <path d="M4 20V6.5A1.5 1.5 0 0 1 5.5 5H14v15M14 9h4.5A1.5 1.5 0 0 1 20 10.5V20M4 20h16M7.5 8.5h2M7.5 12h2M7.5 15.5h2M16 13h1.5M16 16h1.5" />
      </svg>
    );
  }
  if (name === 'pin') {
    return (
      <svg {...common}>
        <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    );
  }
  if (name === 'calendar') {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3.5V7M16 3.5V7M4 10h16" />
      </svg>
    );
  }
  if (name === 'clock') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4.5l3 2" />
      </svg>
    );
  }
  if (name === 'user') {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3" />
        <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
      </svg>
    );
  }
  if (name === 'phone') {
    return (
      <svg {...common}>
        <path d="M8 3.5h8A1.5 1.5 0 0 1 17.5 5v14a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 19V5A1.5 1.5 0 0 1 8 3.5Z" />
        <path d="M10 18h4" />
      </svg>
    );
  }
  if (name === 'sofa') {
    return (
      <svg {...common}>
        <path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11M4 13.5h16V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3.5Z" />
        <path d="M4 14.5h16" />
      </svg>
    );
  }
  if (name === 'house') {
    return (
      <svg {...common}>
        <path d="M4 11 12 4l8 7" />
        <path d="M6.5 10.5V20h11v-9.5" />
      </svg>
    );
  }
  if (name === 'shield') {
    return (
      <svg {...common}>
        <path d="M12 3.5 19 6v6.2c0 4-2.8 6.8-7 8.3-4.2-1.5-7-4.3-7-8.3V6l7-2.5Z" />
        <path d="M9 12.2 11 14l4-4.2" />
      </svg>
    );
  }
  if (name === 'mail') {
    return (
      <svg {...common}>
        <rect x="3.5" y="6" width="17" height="12" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }
  if (name === 'check') {
    return (
      <svg {...common}>
        <path d="m6 12.5 4 4 8-9" />
      </svg>
    );
  }
  return null;
}

export default function HomeBookingForm() {
  const navigate = useNavigate();
  const site = useCatalog();
  const [segment, setSegment] = useState('Residential');
  const [serviceKey, setServiceKey] = useState('full');
  const [showOffice, setShowOffice] = useState(false);
  const [size, setSize] = useState('1BHK');
  const [type, setType] = useState('Furnished');
  const [time, setTime] = useState(TIMES[0]);
  const [city, setCity] = useState(site.cities[0]);
  const [includedOpen, setIncludedOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const card = [...CARDS, OFFICE_CARD].find((item) => item.key === serviceKey) || CARDS[0];
  const rate = useMemo(
    () => chooseRate(site, segment, card.service, size, type),
    [site, segment, card.service, size, type],
  );
  const pricing = rate ? calcOneTime(rate, rate.quantity) : null;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!rate || !pricing || submitting) return;
    const form = new FormData(event.currentTarget);
    const phone = digitsOnlyPhone(form.get('phone'));
    const name = String(form.get('name') || '').trim();
    const address = String(form.get('address') || '').trim();
    const preferredDate = String(form.get('date') || '').trim();

    if (name.length < 2 || !/^[6-9]\d{9}$/.test(phone) || address.length < 5 || !preferredDate) {
      setError('Enter your full address, date, name and a 10-digit mobile number.');
      return;
    }

    const matchedCity = cityFromAddress(address, site.cities) || city;
    setError(null);
    setSubmitting(true);
    try {
      await submitDeepCleaningInquiry({
        name,
        mobile: phone,
        city: matchedCity,
        address,
        segment,
        service: card.service,
        package_name: rate.package,
        package_id: rate.id,
        quantity: String(rate.quantity),
        unit: rate.unit || '',
        plan: 'one',
        property_size: size,
        property_type: type,
        preferred_date: preferredDate,
        preferred_time: time,
        estimated_price: pricing.total,
        regular_price: pricing.base,
        discount_amount: 0,
        notes: '',
        page_url: typeof window !== 'undefined' ? window.location.href : '',
      });
      goToThankYou(navigate, {
        name,
        service: card.service,
        packageName: rate.package,
        city: matchedCity,
        address,
        preferredDate,
        preferredTime: time,
        price: pricing.total,
      });
    } catch (err) {
      setError(err?.message || 'Could not submit booking request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const visibleCards = showOffice || serviceKey === 'office' ? [...CARDS, OFFICE_CARD] : CARDS;

  return (
    <form id="home-booking" className="dc-book" noValidate onSubmit={handleSubmit}>
      <h1>Book Your Cleaning</h1>

      <div className="dc-segment" role="group" aria-label="Property category">
        <button
          type="button"
          className={segment === 'Residential' ? 'is-on' : undefined}
          aria-pressed={segment === 'Residential'}
          onClick={() => setSegment('Residential')}
        >
          <Icon name="home" />
          Residential
        </button>
        <button
          type="button"
          className={segment === 'Commercial' ? 'is-on' : undefined}
          aria-pressed={segment === 'Commercial'}
          onClick={() => setSegment('Commercial')}
        >
          <Icon name="building" />
          Commercial
        </button>
      </div>

      <h2>Choose cleaning service</h2>
      <div className="dc-services">
        {visibleCards.map((item) => {
          const selected = item.key === serviceKey;
          return (
            <button
              key={item.key}
              type="button"
              className={selected ? 'is-on' : undefined}
              aria-pressed={selected}
              onClick={() => setServiceKey(item.key)}
            >
              <span className="dc-services-photo">
                <img src={item.image} alt="" />
                {selected ? (
                  <span className="dc-check">
                    <Icon name="check" />
                  </span>
                ) : null}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="dc-more"
        onClick={() => {
          setShowOffice(true);
          setServiceKey('office');
        }}
      >
        Office &amp; other services →
      </button>

      <div className="dc-label-row">
        <h2>Home size</h2>
      </div>
      <div className="dc-sizes" role="group" aria-label="Home size">
        {SIZES.map((item) => (
          <button
            key={item}
            type="button"
            className={size === item ? 'is-on' : undefined}
            aria-pressed={size === item}
            onClick={() => setSize(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="dc-label-row">
        <h2>Property condition</h2>
        <button type="button" className="dc-info" onClick={() => setIncludedOpen(true)}>
          ⓘ What is included?
        </button>
      </div>
      <div className="dc-condition" role="group" aria-label="Property condition">
        <button
          type="button"
          className={type === 'Furnished' ? 'is-on' : undefined}
          aria-pressed={type === 'Furnished'}
          onClick={() => setType('Furnished')}
        >
          <Icon name="sofa" />
          Furnished
        </button>
        <button
          type="button"
          className={type === 'Empty' ? 'is-on' : undefined}
          aria-pressed={type === 'Empty'}
          onClick={() => setType('Empty')}
        >
          <Icon name="house" />
          Empty
        </button>
      </div>

      <h2>Complete address</h2>
      <label className="dc-field">
        <Icon name="pin" />
        <AddressAutocomplete
          name="address"
          placeholder="Area, building & full address"
          required
          maxLength={300}
          onSelect={(address) => {
            const match = cityFromAddress(address, site.cities);
            if (match) setCity(match);
          }}
        />
      </label>

      <div className="dc-split" id="dc-when">
        <div>
          <h2>Date</h2>
          <label className="dc-field">
            <Icon name="calendar" />
            <input name="date" type="date" min={todayISO()} required />
          </label>
        </div>
        <div>
          <h2>Time</h2>
          <label className="dc-field">
            <Icon name="clock" />
            <select name="time" value={time} onChange={(event) => setTime(event.target.value)}>
              {TIMES.map((slot) => (
                <option key={slot}>{slot}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="dc-split" id="dc-customer">
        <div>
          <h2>Name</h2>
          <label className="dc-field">
            <Icon name="user" />
            <input name="name" placeholder="Full name" autoComplete="name" maxLength={100} required />
          </label>
        </div>
        <div>
          <h2>Mobile number</h2>
          <label className="dc-field">
            <Icon name="phone" />
            <span className="dc-code">+91</span>
            <input
              name="phone"
              placeholder="10-digit number"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={14}
              required
            />
          </label>
        </div>
      </div>

      {pricing && rate ? (
        <div className="dc-price">
          <div>
            <strong>
              {size} • {type}
            </strong>
            <small>Price (excl. GST)</small>
          </div>
          <div className="dc-price-meta">
            <span>30% OFF</span>
            <b>{money(pricing.total)}</b>
          </div>
        </div>
      ) : null}
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <button className="dc-submit" type="submit" disabled={!rate || submitting}>
        {submitting ? 'Submitting…' : 'Confirm Booking →'}
      </button>

      <a className="dc-pest" href="https://www.pestcontrol99.com/" target="_blank" rel="noopener noreferrer">
        <span className="dc-pest-mark">
          <Icon name="shield" />
        </span>
        <span>
          <strong>Need Pest Control?</strong>
          <small>Pestcontrol99.com</small>
        </span>
        <em>View ↗</em>
      </a>

      <div className="dc-inquiry">
        <span />
        <Link to="/contact-us/">
          <Icon name="mail" />
          Send Inquiry
        </Link>
        <span />
      </div>

      {includedOpen ? (
        <div className="dc-modal" role="presentation" onClick={() => setIncludedOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="included-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="included-title">What is included?</h3>
            <p>
              {rate?.package}. {rate?.note}
            </p>
            <p>
              The price shown is the service amount before GST. Applicable GST is extra and is
              confirmed before the visit. Heavy grease, renovation residue and work outside this
              package are quoted separately.
            </p>
            <button type="button" onClick={() => setIncludedOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
