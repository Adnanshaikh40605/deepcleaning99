/** Browser session that links the booking form to one DeepCleaning99 lead. */

const SESSION_KEY = 'dc99_booking_session_id';

function createToken() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `dc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getBookingSessionId() {
  if (typeof window === 'undefined') return createToken();
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing && existing.length >= 8) return existing;
    const next = createToken();
    sessionStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return createToken();
  }
}

/** Fresh session so a new visit or a replaced number creates a new lead. */
export function rotateBookingSession() {
  if (typeof window === 'undefined') return createToken();
  try {
    const next = createToken();
    sessionStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return createToken();
  }
}
