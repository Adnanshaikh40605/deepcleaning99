const STORAGE_KEY = 'dc-thank-you';

export function saveThankYou(booking) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(booking));
  } catch {
    /* private mode can block storage; the route state still carries the booking */
  }
}

export function readThankYou() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

export function goToThankYou(navigate, booking) {
  saveThankYou(booking);
  navigate('/thank-you/', { replace: true, state: booking });
}
