import BookingForm from '../components/BookingForm';
import PageHero from '../components/PageHero';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function BookCleaning() {
  useDocumentMeta({
    title: 'Book Deep Cleaning Online | Deepcleaning99',
    description:
      'Choose your cleaning service, enter the property details and review your price before confirming a Deepcleaning99 booking.',
    path: '/book-cleaning/',
  });

  return (
    <>
      <PageHero
        eyebrow="DEEPCLEANING99"
        title="Book your cleaning service"
        description="Choose the service and tell us a little about the property. You will be able to review the included work and price before submitting your booking."
      />
      <BookingForm />
    </>
  );
}
