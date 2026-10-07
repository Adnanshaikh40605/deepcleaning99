import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const guides = [
  {
    to: '/guides/prepare-home-for-deep-cleaning/',
    title: 'How to prepare your home for a deep cleaning visit',
    text: 'A practical checklist for clearing cupboards, arranging access and planning upholstery drying before a home deep-cleaning appointment.',
  },
  {
    to: '/guides/sofa-cleaning-drying-and-stains/',
    title: 'What to check before booking sofa cleaning',
    text: 'Understand why sofa material, ventilation and existing stains affect cleaning methods, drying and results before booking a service.',
  },
  {
    to: '/guides/office-deep-cleaning-checklist/',
    title: 'What an office deep cleaning quote should cover',
    text: 'Prepare an office-cleaning enquiry with floor area, washrooms, carpets, access hours and equipment instructions for a clearer quotation.',
  },
];

export default function Guides() {
  useDocumentMeta({
    title: 'Practical Cleaning Guides | Deepcleaning99',
    description:
      'Read practical tips for preparing your home, sofa and office for a deep cleaning visit.',
    path: '/guides/',
  });

  return (
    <>
      <PageHero
        title="Before your cleaning visit."
        description="Practical guides to preparation, drying and service scope."
      />
      <section className="section wrap guide-grid">
        {guides.map((guide) => (
          <article className="info-card" key={guide.to}>
            <h2>
              <Link to={guide.to}>{guide.title}</Link>
            </h2>
            <p>{guide.text}</p>
          </article>
        ))}
      </section>
    </>
  );
}
