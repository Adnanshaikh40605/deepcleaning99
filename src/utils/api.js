const PROD_API = 'https://api.vacationbna.site/api';

export function apiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv && String(fromEnv).trim()) {
    return String(fromEnv).trim().replace(/\/$/, '');
  }
  if (import.meta.env.PROD) return PROD_API;
  return 'http://localhost:8000/api';
}

/**
 * Submit a DeepCleaning99 booking request → CRM DeepCleaning99 Inquiries.
 * POST /api/deepcleaning-inquiries/
 */
export async function submitDeepCleaningInquiry(payload) {
  const url = `${apiBaseUrl()}/deepcleaning-inquiries/`;
  const controller =
    typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer =
    controller && typeof window !== 'undefined'
      ? window.setTimeout(() => controller.abort(), 15000)
      : null;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller?.signal,
    });

    let data = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      const details = data?.details || data?.error || data?.message;
      const message =
        typeof details === 'string'
          ? details
          : Array.isArray(details)
            ? details.join(' ')
            : 'Could not submit booking request. Please try again.';
      const err = new Error(message);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } finally {
    if (timer) window.clearTimeout(timer);
  }
}

export function digitsOnlyPhone(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}
