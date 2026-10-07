import site from '../data/site';

export function whatsappUrl(message) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message) {
  const url = whatsappUrl(message);
  window.open(url, '_blank', 'noopener,noreferrer');
  return url;
}
