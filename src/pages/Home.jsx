import { Link } from 'react-router-dom';
import HomeBookingForm from '../components/HomeBookingForm';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { money } from '../utils/pricing';

const services = [
  {
    title: 'Full Home Deep Cleaning',
    href: '/full-home-deep-cleaning/',
    note: 'Cleaning for furnished and empty flats, bungalows and villas. Choose your property size and check the areas included in your package.',
    regular: 3499,
    price: 2449,
    photo: 1,
  },
  {
    title: 'Kitchen Deep Cleaning',
    href: '/kitchen-deep-cleaning/',
    note: 'Attention to grease on accessible tiles, countertops, sinks and cabinets. Share the kitchen condition so we can recommend the right scope.',
    regular: 1499,
    price: 1049,
    photo: 2,
  },
  {
    title: 'Bathroom Deep Cleaning',
    href: '/bathroom-deep-cleaning/',
    note: 'Cleaning for tiles, toilets, basins and suitable fittings, including accessible soap residue and scale buildup.',
    regular: 699,
    price: 489,
    photo: 3,
  },
  {
    title: 'Sofa Cleaning',
    href: '/sofa-cleaning/',
    note: 'Fabric sofa cleaning using a method suited to the upholstery. Leather sofas need a separate cleaning process.',
    regular: 899,
    price: 629,
    photo: 4,
  },
  {
    title: 'Mattress Cleaning',
    href: '/mattress-cleaning/',
    note: 'Vacuuming and suitable surface cleaning for single, double and king-size mattresses. The material and condition determine the method.',
    regular: 699,
    price: 489,
    photo: 5,
  },
  {
    title: 'Carpet Cleaning',
    href: '/carpet-cleaning/',
    note: 'Cleaning for suitable rugs and fitted carpets at homes and commercial properties. Share the size and material for a quote.',
    regular: 960,
    price: 672,
    photo: 6,
  },
  {
    title: 'Office Deep Cleaning',
    href: '/office-deep-cleaning/',
    note: 'Scheduled cleaning for workstations, floors, accessible glass, pantries and washrooms, with the scope agreed before the visit.',
    office: true,
    photo: 7,
  },
];

const steps = [
  {
    n: '1',
    title: 'Choose your service',
    text: 'Select the cleaning job and enter the size or quantity.',
  },
  {
    n: '2',
    title: 'Check your booking',
    text: 'Review the included work, price, location and preferred appointment.',
  },
  {
    n: '3',
    title: 'Confirm your details',
    text: 'Submit your booking. Our team will verify the details and confirm availability before the visit.',
  },
];

const faqs = [
  {
    q: 'Is sofa shampooing included in full-home cleaning?',
    a: 'It is a separate service unless your selected package specifically includes it. Check the booking summary before confirming.',
  },
  {
    q: 'Can I book only one room or item?',
    a: 'You can choose kitchen, bathroom, sofa, mattress or carpet cleaning separately. Minimum booking charges may apply.',
  },
  {
    q: 'Do you clean commercial properties?',
    a: 'Yes. We provide commercial deep cleaning with a scope and quotation based on the property.',
  },
  {
    q: 'Will you bring the equipment?',
    a: 'The cleaning team brings the equipment and cleaning products needed for the agreed work. We will tell you if access, water, electricity or any other preparation is required.',
  },
];

export default function Home() {
  useDocumentMeta({
    title: 'Home and Office Deep Cleaning Services | Deepcleaning99',
    description:
      'Book home, kitchen, bathroom, sofa, mattress, carpet and office cleaning in Mumbai, Thane, Navi Mumbai, Pune and Lonavala with Deepcleaning99.',
    path: '/',
  });

  return (
    <>
      <section className="hero-stage">
        <div className="wrap hero-grid">
          <div className="hero-visual">
            <img
              className="hero-image"
              src="/assets/hero-mobile.jpg"
              width={682}
              height={1024}
              alt="Cleaning team deep cleaning a bright home, including the sofa, kitchen, windows and bathroom"
              fetchPriority="high"
            />
            <div className="hero-copy">
              <h1>
                Deep cleaning
                <br />
                for your home
                <br />
                <em>and workplace</em>
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
                <div>
                  <span className="benefit-icon" aria-hidden="true">
                    ✓
                  </span>
                  <strong>
                    Clear
                    <br />
                    Service Scope
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
          <h2>Choose what you need cleaned</h2>
          <p>
            The kitchen needs more than a quick wipe. The sofa has been used
            every day. Or you are moving into a flat and want it cleaned before
            the furniture arrives. Tell us what needs attention, and choose a
            cleaning service that fits your property.
          </p>
        </div>
        <div className="service-grid">
          {services.map((item) => (
            <Link className="service-card" key={item.href} to={item.href}>
              <div
                className={`service-photo photo-${item.photo}`}
                role="img"
                aria-label={item.title}
              />
              <div className="service-copy">
                <h3>{item.title}</h3>
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

      <section className="section wrap">
        <div className="section-intro">
          <h2>Know the scope before the team arrives</h2>
          <p>
            Full-home cleaning and sofa shampooing are different jobs. An empty
            flat and a furnished flat also need different amounts of work. We
            explain what your booking covers, which items are extra and what
            needs to be cleared before the visit. If the property needs
            additional work, we discuss it with you before changing the scope
            or price.
          </p>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="wrap how-grid">
          <div>
            <h2>How booking works</h2>
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
            <h3>Cleaning for commercial properties</h3>
            <p>
              An office may need an after-hours visit. A restaurant kitchen may
              need heavier grease removal. A guest property may have several
              rooms and mattresses to clean. Send the property size, photographs
              and preferred schedule so we can prepare a suitable quotation.
            </p>
            <Link className="button outline full" to="/commercial-deep-cleaning/">
              Request a Site Survey
            </Link>
          </aside>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-intro">
          <h2>Need cleaning and pest control</h2>
          <p>
            For cockroaches, termites, bed bugs and other pest problems, visit{' '}
            <a className="text-link" href="https://pestcontrol99.com/">
              Pestcontrol99.com
            </a>
            . For deep cleaning, book through Deepcleaning99.com. If you need
            both, tell our team so the visits can be planned in a suitable
            order. Cleaning around a recent treatment must follow the
            pest-control technician’s instructions.
          </p>
        </div>
        <div className="prose faq-list">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
