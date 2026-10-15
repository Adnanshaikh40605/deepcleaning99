import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { loadRemoteCatalog } from './catalog';
import Layout from './components/Layout';
import BookCleaning from './pages/BookCleaning';
import Contact from './pages/Contact';
import ContentPage from './pages/ContentPage';
import Guides from './pages/Guides';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Prices from './pages/Prices';
import ThankYou from './pages/ThankYou';

const contentRoutes = [
  '/about-us/',
  '/bathroom-deep-cleaning/',
  '/booking-terms/',
  '/carpet-cleaning/',
  '/commercial-deep-cleaning/',
  '/deep-cleaning-lonavala/',
  '/deep-cleaning-mumbai/',
  '/deep-cleaning-navi-mumbai/',
  '/deep-cleaning-pune/',
  '/deep-cleaning-thane/',
  '/faqs/',
  '/full-home-deep-cleaning/',
  '/guides/office-deep-cleaning-checklist/',
  '/guides/prepare-home-for-deep-cleaning/',
  '/guides/sofa-cleaning-drying-and-stains/',
  '/kitchen-deep-cleaning/',
  '/mattress-cleaning/',
  '/office-deep-cleaning/',
  '/privacy-notice/',
  '/residential-deep-cleaning/',
  '/scheduled-cleaning/',
  '/service-quality/',
  '/sofa-cleaning/',
];

function ContentRoute({ path }) {
  return <ContentPage path={path} />;
}

function CatalogLoader() {
  useEffect(() => {
    loadRemoteCatalog();
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <CatalogLoader />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="prices" element={<Navigate to="/prices/" replace />} />
          <Route path="prices/" element={<Prices />} />
          <Route path="cleaning-prices" element={<Navigate to="/prices/" replace />} />
          <Route path="cleaning-prices/" element={<Navigate to="/prices/" replace />} />
          <Route path="cleaning-amc" element={<Navigate to="/scheduled-cleaning/" replace />} />
          <Route path="cleaning-amc/" element={<Navigate to="/scheduled-cleaning/" replace />} />
          <Route path="book-cleaning" element={<Navigate to="/book-cleaning/" replace />} />
          <Route path="book-cleaning/" element={<BookCleaning />} />
          <Route path="thank-you" element={<Navigate to="/thank-you/" replace />} />
          <Route path="thank-you/" element={<ThankYou />} />
          <Route path="contact-us" element={<Navigate to="/contact-us/" replace />} />
          <Route path="contact-us/" element={<Contact />} />
          <Route path="guides" element={<Navigate to="/guides/" replace />} />
          <Route path="guides/" element={<Guides />} />
          {contentRoutes.map((path) => (
            <Route
              key={path}
              path={path.replace(/^\//, '')}
              element={<ContentRoute path={path} />}
            />
          ))}
          {contentRoutes.map((path) => (
            <Route
              key={`${path}-redir`}
              path={path.replace(/^\//, '').replace(/\/$/, '')}
              element={<Navigate to={path} replace />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
