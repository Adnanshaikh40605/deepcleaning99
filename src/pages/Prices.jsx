import { useMemo, useState } from 'react';
import PageHero from '../components/PageHero';
import RateCard from '../components/RateCard';
import site from '../data/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Prices() {
  useDocumentMeta({
    title: 'Deep Cleaning Rates & 30% Launch Offer | Deepcleaning99',
    description:
      'Browse home and commercial cleaning packages, technician counts, time estimates and AMC rates. Prices exclude applicable GST.',
    path: '/prices/',
  });

  const [segment, setSegment] = useState('Residential');
  const [service, setService] = useState('');
  const [plan, setPlan] = useState('one');

  const rates = useMemo(
    () =>
      site.rates.filter(
        (rate) =>
          rate.segment === segment && (!service || rate.service === service),
      ),
    [segment, service],
  );

  return (
    <>
      <PageHero
        eyebrow="RATES & PACKAGES"
        title="A clear price for the work."
        description="30% off one-time cleaning service charges. Choose a package that fits your space."
      />
      <section className="section wrap">
        <div className="price-filters">
          <label>
            Property
            <select
              value={segment}
              onChange={(event) => setSegment(event.target.value)}
            >
              <option>Residential</option>
              <option>Commercial</option>
            </select>
          </label>
          <label>
            Service
            <select
              value={service}
              onChange={(event) => setService(event.target.value)}
            >
              <option value="">All services</option>
              {site.services.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Plan
            <select
              value={plan}
              onChange={(event) => setPlan(event.target.value)}
            >
              <option value="one">One-time · 30% off</option>
              <option value="amc">Scheduled cleaning / AMC</option>
            </select>
          </label>
        </div>
        <p className="fine">
          All rates exclude applicable GST. Minimum booking charges and package
          caps apply. Commercial and villa quotes depend on a scope review. AMC
          prices use the rate sheet’s scheduled-visit discounts; the 30% offer
          is not added.
        </p>
        <div className="rate-grid">
          {rates.map((rate) => (
            <RateCard key={rate.id} rate={rate} plan={plan} />
          ))}
        </div>
      </section>
    </>
  );
}
