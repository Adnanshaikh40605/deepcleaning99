let placesPromise = null;

export function googleMapsApiKey() {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const trimmed = typeof key === 'string' ? key.trim() : '';
  return trimmed || '';
}

function placesReady() {
  return typeof window !== 'undefined' && Boolean(window.google?.maps?.places);
}

/** Loads the Maps JS API with the Places library once and resolves with `window.google`. */
export function loadGooglePlaces() {
  if (placesReady()) return Promise.resolve(window.google);
  if (placesPromise) return placesPromise;

  const key = googleMapsApiKey();
  if (!key || typeof document === 'undefined') {
    return Promise.reject(new Error('Google Maps API key is not configured.'));
  }

  placesPromise = new Promise((resolve, reject) => {
    window.__dcGmapsInit = () => {
      if (placesReady()) resolve(window.google);
      else reject(new Error('Google Places library did not load.'));
    };
    const script = document.createElement('script');
    script.id = 'dc-google-maps';
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&loading=async&callback=__dcGmapsInit`;
    script.onerror = () => {
      placesPromise = null;
      script.remove();
      reject(new Error('Google Maps script failed to load.'));
    };
    document.head.appendChild(script);
  });

  return placesPromise;
}

/** Picks the service city mentioned in an address; longer names first so "Navi Mumbai" wins over "Mumbai". */
export function cityFromAddress(address, cities) {
  const text = String(address || '').toLowerCase();
  return (
    [...cities]
      .sort((a, b) => b.length - a.length)
      .find((city) => text.includes(city.toLowerCase())) || null
  );
}
