import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function NotFound() {
  useDocumentMeta({
    title: 'Page Not Found | Deepcleaning99',
    description: 'Return to Deepcleaning99 services and booking.',
    path: '/404.html',
  });

  return (
    <section className="section wrap not-found">
      <h1>Let’s get you back to a cleaner space.</h1>
      <p>This page could not be found.</p>
      <Link className="button" to="/">
        Go to home
      </Link>
    </section>
  );
}
