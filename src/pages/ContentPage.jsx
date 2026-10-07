import { Link } from 'react-router-dom';
import AsideCard from '../components/AsideCard';
import PageHero from '../components/PageHero';
import Prose from '../components/Prose';
import RateCard from '../components/RateCard';
import { getPage } from '../data/pages';
import site from '../data/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

function crumbsFrom(text) {
  if (!text) return null;
  const parts = text.split('/').map((part) => part.trim()).filter(Boolean);
  if (!parts.length) return null;
  return (
    <>
      <Link to="/">Home</Link>
      {parts.slice(1).map((part) => (
        <span key={part}> / {part}</span>
      ))}
    </>
  );
}

export default function ContentPage({ path }) {
  const page = getPage(path);

  useDocumentMeta({
    title: page?.title || 'Deepcleaning99',
    description: page?.description || '',
    path,
  });

  if (!page) {
    return (
      <section className="section wrap">
        <h1>Page not found</h1>
        <Link className="button" to="/">
          Go to home
        </Link>
      </section>
    );
  }

  const rates = page.dataService
    ? site.rates.filter(
        (rate) =>
          rate.service === page.dataService && rate.segment === 'Residential',
      )
    : [];

  const showAside = Boolean(page.aside) || Boolean(page.proseHtml);
  const isFaqPage = path === '/faqs/';
  const hideCta = ['/privacy-notice/', '/booking-terms/', '/service-quality/'].includes(
    path,
  );

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.h1}
        description={page.heroP}
        crumbs={crumbsFrom(page.crumbs)}
        cta={
          !hideCta && (page.crumbs || page.eyebrow === 'DEEPCLEANING99')
            ? { to: '/book-cleaning/', label: 'Book cleaning' }
            : undefined
        }
      />

      {page.cards?.length ? (
        <section className="section wrap contact-grid">
          {page.cards.map((card) => (
            <article className="info-card" key={card.h}>
              <h2>{card.h}</h2>
              <p>{card.p}</p>
              {card.links?.map(([label, href]) =>
                href?.startsWith('http') || href?.startsWith('tel:') ? (
                  <a
                    key={href}
                    className="button"
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {label}
                  </a>
                ) : (
                  <Link key={href} className="button" to={href}>
                    {label}
                  </Link>
                ),
              )}
            </article>
          ))}
        </section>
      ) : null}

      {(page.proseHtml || page.faqs?.length) && (
        <section className="section wrap article-layout">
          <div>
            {isFaqPage && page.faqs?.length ? (
              <div className="prose faq-list">
                {page.faqs.map((item) => (
                  <details key={item.q}>
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            ) : (
              <Prose html={page.proseHtml} />
            )}

            {rates.length ? (
              <div className="rate-grid service-rates">
                {rates.map((rate) => (
                  <RateCard key={rate.id} rate={rate} />
                ))}
              </div>
            ) : null}
          </div>
          {showAside ? <AsideCard title={page.aside?.h} text={page.aside?.p} /> : null}
        </section>
      )}

      {!page.proseHtml && !page.faqs?.length && !page.cards?.length && rates.length ? (
        <section className="section wrap">
          <div className="rate-grid">
            {rates.map((rate) => (
              <RateCard key={rate.id} rate={rate} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
