import { Link } from 'react-router-dom';
import HomeBookingForm from '../components/HomeBookingForm';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { money } from '../utils/pricing';

const services = [
  {
    title: 'Full Home\nCleaning',
    href: '/full-home-deep-cleaning/',
    note: 'Starting from (1BHK)',
    regular: 3499,
    price: 2449,
    photo: 1,
  },
  {
    title: 'Kitchen\nCleaning',
    href: '/kitchen-deep-cleaning/',
    note: 'Occupied kitchen',
    regular: 1499,
    price: 1049,
    photo: 2,
  },
  {
    title: 'Bathroom\nCleaning',
    href: '/bathroom-deep-cleaning/',
    note: 'Per bathroom',
    regular: 699,
    price: 489,
    photo: 3,
  },
  {
    title: 'Sofa\nCleaning',
    href: '/sofa-cleaning/',
    note: '3-seat fabric sofa',
    regular: 899,
    price: 629,
    photo: 4,
  },
  {
    title: 'Mattress\nCleaning',
    href: '/mattress-cleaning/',
    note: 'Single mattress',
    regular: 699,
    price: 489,
    photo: 5,
  },
  {
    title: 'Carpet\nCleaning',
    href: '/carpet-cleaning/',
    note: '80 sq ft rug',
    regular: 960,
    price: 672,
    photo: 6,
  },
  {
    title: 'Office\nCleaning',
    href: '/office-deep-cleaning/',
    note: 'Custom office quotation',
    office: true,
    photo: 7,
  },
];

const steps = [
  {
    n: '1',
    title: 'Choose Service',
    text: 'Select your cleaning service and details.',
  },
  {
    n: '2',
    title: 'Send Your Request',
    text: 'Fill in your details and send on WhatsApp.',
  },
  {
    n: '3',
    title: 'Booking Confirmation',
    text: 'Our team confirms the price and appointment.',
  },
];

export default function Home() {
  useDocumentMeta({
    title: 'Home & Office Deep Cleaning | Deepcleaning99',
    description:
      'Book full home, kitchen, bathroom, sofa, mattress, carpet and office cleaning in Mumbai, Thane, Navi Mumbai, Pune and Lonavala. Call 7710082627.',
    path: '/',
  });

  return (
    <>
      <section className="hero-stage">
        <div className="wrap hero-grid">
          <div className="hero-visual">
            <img
              className="hero-image"
              src="/assets/cleaning-hero.webp"
              width={1536}
              height={1024}
              alt="Cleaning technician using professional extraction equipment on a fabric sofa"
              fetchPriority="high"
            />
            <div className="hero-copy">
              <h1>
                Professional
                <br />
                Deep Cleaning
                <br />
                <em>At Your Doorstep</em>
              </h1>
              <p className="hero-locations">
                Mumbai · Navi Mumbai · Thane
                <span>Pune · Lonavala</span>
              </p>
              <div className="hero-benefits">
                <div>
                  <span className="benefit-icon" aria-hidden="true">
                    ✓
                  </span>
                  <strong>
                    Trained
                    <br />
                    Cleaning Teams
                  </strong>
                </div>
                <div>
                  <span className="benefit-icon" aria-hidden="true">
                    ✓
                  </span>
                  <strong>
                    Professional
                    <br />
                    Equipment
                  </strong>
                </div>
              </div>
            </div>
          </div>
          <HomeBookingForm />
        </div>
      </section>

      <section className="services-section wrap" id="services">
        <div className="section-intro">
          <h2>Our Cleaning Services</h2>
          <p>Professional cleaning for a fresher home and workplace.</p>
        </div>
        <div className="service-grid">
          {services.map((item) => (
            <Link className="service-card" key={item.href} to={item.href}>
              <div
                className={`service-photo photo-${item.photo}`}
                role="img"
                aria-label={item.title.replace('\n', ' ')}
              />
              <div className="service-copy">
                <h3>
                  {item.title.split('\n').map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h3>
                <p>{item.note}</p>
                {item.office ? (
                  <p className="office-note">
                    Custom quote for your office or commercial space.
                  </p>
                ) : (
                  <>
                    <div className="service-price">
                      <del>{money(item.regular)}</del>
                      <strong>{money(item.price)}</strong>
                    </div>
                    <span className="offer">30% OFF</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="service-notes">
          <span>
            30% off one-time service charges · GST extra · package caps and
            minimum charges apply.
          </span>
          <Link to="/prices/">View all rates & AMC packages</Link>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="wrap how-grid">
          <div>
            <h2>How It Works</h2>
            <div className="steps">
              {steps.map((step) => (
                <article key={step.n}>
                  <b>{step.n}</b>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <aside className="how-aside">
            <h3>Office or Commercial Property?</h3>
            <p>
              Get a custom quote for your office, commercial space or large
              property.
            </p>
            <Link className="button outline full" to="/commercial-deep-cleaning/">
              Request a Custom Quote
            </Link>
          </aside>
        </div>
      </section>

      <section className="more-section wrap">
        <details>
          <summary>Service scope, cleaning plans & useful information</summary>
          <div>
            <p>
              Deepcleaning99.com provides residential and commercial deep
              cleaning under Multi Pest Care LLP, as part of Pestcontrol99.com.
              Our team brings equipment and products for the agreed work.
            </p>
            <p>
              Full-home cleaning covers accessible surfaces, one kitchen and the
              package’s capped number of bathrooms. Sofa, mattress and carpet
              cleaning are separate services. Permanent stains and existing
              damage may remain.
            </p>
            <p>
              Call centre and WhatsApp support are available 24×7. Cleaning
              visits depend on appointment availability. Scheduled AMC packages
              cover an agreed number of visits and do not include daily
              housekeeping. AMC discounts do not combine with the 30% one-time
              offer.
            </p>
            <p>
              <Link className="text-link" to="/faqs/">
                Read FAQs
              </Link>{' '}
              ·{' '}
              <Link className="text-link" to="/guides/">
                Cleaning guides
              </Link>{' '}
              ·{' '}
              <Link className="text-link" to="/service-quality/">
                Service quality
              </Link>
            </p>
          </div>
        </details>
      </section>
    </>
  );
}
