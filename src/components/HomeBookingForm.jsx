import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCatalog } from '../catalog';
import {
  calcOneTime,
  findFullHomePackage,
  money,
  todayISO,
} from '../utils/pricing';
import { digitsOnlyPhone, isValidBookingMobile } from '../utils/api';
import { useDeepCleaningSilentLead } from '../utils/useSilentLead';
import { goToThankYou } from '../utils/thankYou';
import { cityFromAddress } from '../utils/googleMaps';
import AddressAutocomplete from './AddressAutocomplete';

const SIZES = ['Chawl', '1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK'];
const TIERS = ['Standard', 'Premium'];
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

function chooseRate(catalog, segment, service, size, type, tier) {
  const residential = segment !== 'Commercial';
  const pool = catalog.rates.filter(
    (rate) => rate.service === service && rate.segment === (residential ? 'Residential' : 'Commercial'),
  );
  const fallback = pool[0] || catalog.rates.find((rate) => rate.service === service) || null;
  const big = ['3BHK', '4BHK', '5BHK'].includes(size);
  const mid = size === '2BHK';
  const id = residential
    ? {
        'Full Home Deep Cleaning': null,
        'Kitchen Deep Cleaning': type === 'Empty' ? 'K01' : 'K03',
        'Bathroom Deep Cleaning': ['Chawl', '1RK', '1BHK'].includes(size) ? 'A01' : size === '2BHK' ? 'A02' : 'A03',
        'Sofa Cleaning': {
          Chawl: 'W03',
          '1RK': 'W03',
          '1BHK': 'W03',
          '2BHK': 'W05',
          '3BHK': 'W07',
          '4BHK': 'W10',
          '5BHK': 'W10',
        }[size],
        'Mattress Cleaning': {
          Chawl: 'A13',
          '1RK': 'A13',
          '1BHK': 'A14',
          '2BHK': 'A14',
          '3BHK': 'A15',
          '4BHK': 'A15',
          '5BHK': 'A15',
        }[size],
        'Carpet Cleaning': 'A16',
        'Office Deep Cleaning': 'R29',
      }[service]
    : {
        'Full Home Deep Cleaning': 'C1',
        'Kitchen Deep Cleaning': big ? 'C4' : mid ? 'C3' : 'C2',
        'Bathroom Deep Cleaning': big ? 'C6' : 'C5',
        'Sofa Cleaning': 'C7',
        'Mattress Cleaning': big || mid ? 'C10' : 'C9',
        'Carpet Cleaning': big ? 'C13' : mid ? 'C12' : 'C11',
        'Office Deep Cleaning': {
          Chawl: 'C14',
          '1RK': 'C14',
          '1BHK': 'C14',
          '2BHK': 'C15',
          '3BHK': 'C16',
          '4BHK': 'C17',
          '5BHK': 'C17',
        }[size],
      }[service];

  if (residential && service === 'Full Home Deep Cleaning') {
    return findFullHomePackage(size, type, tier) || fallback;
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
  const [tier, setTier] = useState('Standard');
  const [time, setTime] = useState(TIMES[0]);
  const [city, setCity] = useState(site.cities[0]);
  const [includedOpen, setIncludedOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');

  const card = [...CARDS, OFFICE_CARD].find((item) => item.key === serviceKey) || CARDS[0];
  const showHomeTier = segment !== 'Commercial' && card.service === 'Full Home Deep Cleaning';
  const rate = useMemo(
    () => chooseRate(site, segment, card.service, size, type, tier),
    [site, segment, card.service, size, type, tier],
  );
  const pricing = rate ? calcOneTime(rate, rate.quantity) : null;
  const matchedCity = cityFromAddress(address, site.cities) || city;
  const leadSnapshot = useMemo(
    () => ({
      name: name.trim(),
      mobile: phone,
      city: matchedCity,
      address: address.trim(),
      segment,
      service: card.service,
      package_name: rate?.package || '',
      package_id: rate?.id || '',
      quantity: rate ? String(rate.quantity) : '',
      unit: rate?.unit || '',
      plan: 'one',
      property_size: size,
      property_type: type,
      preferred_date: date,
      preferred_time: time,
      estimated_price: pricing?.total ?? null,
      regular_price: pricing?.base ?? null,
      discount_amount: 0,
      notes: '',
      page_url: typeof window !== 'undefined' ? window.location.href : '',
    }),
    [
      name,
      phone,
      matchedCity,
      address,
      segment,
      card.service,
      rate,
      size,
      type,
      date,
      time,
      pricing,
    ],
  );
  const { flush } = useDeepCleaningSilentLead(leadSnapshot);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!rate || !pricing || submitting) return;
    const preferredDate = date.trim();

    if (name.trim().length < 2 || !isValidBookingMobile(phone) || address.trim().length < 5 || !preferredDate) {
      setError('Enter your full address, date, name and a 10-digit mobile number.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await flush();
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

      {showHomeTier ? (
        <>
          <div className="dc-label-row">
            <h2>Package</h2>
          </div>
          <div className="dc-condition" role="group" aria-label="Package">
            {TIERS.map((item) => (
              <button
                key={item}
                type="button"
                className={tier === item ? 'is-on' : undefined}
                aria-pressed={tier === item}
                onClick={() => setTier(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </>
      ) : null}

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

      <div className="dc-split" id="dc-when">
        <div>
          <h2>Date</h2>
          <label className="dc-field">
            <Icon name="calendar" />
            <input
              name="date"
              type="date"
              min={todayISO()}
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
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
            <input
              name="name"
              placeholder="Full name"
              autoComplete="name"
              maxLength={100}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
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
              value={phone}
              onChange={(event) => setPhone(digitsOnlyPhone(event.target.value).slice(0, 10))}
            />
          </label>
        </div>
      </div>

      {pricing && rate ? (
        <div className="dc-price">
          <div>
            <strong>
              {showHomeTier ? `${size} • ${type} • ${tier}` : rate.package}
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
