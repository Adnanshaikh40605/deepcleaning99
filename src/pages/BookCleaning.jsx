import BookingForm from '../components/BookingForm';
import PageHero from '../components/PageHero';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function BookCleaning() {
  useDocumentMeta({
    title: 'Book Deep Cleaning | Deepcleaning99',
    description:
      'Choose your cleaning package, review the estimate and request an appointment on WhatsApp. Call 7710082627 for 24x7 support.',
    path: '/book-cleaning/',
  });

  return (
    <>
      <PageHero
        eyebrow="YOUR CLEANING, YOUR SCHEDULE"
        title="Book a cleaner space."
        description="Select a package, review the estimate and send your booking request."
      />
      <BookingForm />
    </>
  );
}
