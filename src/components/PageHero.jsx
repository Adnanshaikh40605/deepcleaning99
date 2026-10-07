import { Link } from 'react-router-dom';

export default function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  cta,
}) {
  return (
    <section className="page-hero">
      <div className="wrap">
        {crumbs ? <div className="breadcrumbs">{crumbs}</div> : null}
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
        {cta ? (
          <Link className="button" to={cta.to}>
            {cta.label}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
