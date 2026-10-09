import { useMemo, useState } from 'react';
import PageHero from '../components/PageHero';
import RateCard from '../components/RateCard';
import site from '../data/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Prices() {
  useDocumentMeta({
    title: 'Deep Cleaning Prices and Package Details | Deepcleaning99',
    description:
      'Compare cleaning package prices and check the included work, minimum charges, discounts and total payable before booking with Deepcleaning99.',
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
        title="Cleaning prices with the scope clearly shown"
        description="We price full-home cleaning by the agreed property size and condition. Sofas are usually quoted by seat count, mattresses by size and quantity, and carpets by measured area. Commercial cleaning needs a scope-based quotation."
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
          Every price card shows what it covers. Check the area cap, included
          bathrooms or items, minimum booking amount and any separately priced
          work before confirming. Where the 30% offer applies, the booking
          summary shows the regular service price, discount and service amount.
          Applicable GST is extra and is confirmed before the visit. The offer
          applies only to the eligible one-time scope and is not combined with
          a scheduled cleaning discount. Heavy grease, renovation residue,
          special upholstery, extra areas and access restrictions may need a
          revised quotation. We discuss additional work before adding it.
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
