import { useCallback, useEffect, useRef } from 'react';
import { isValidBookingMobile, upsertDeepCleaningInquiry } from './api';
import { getBookingSessionId, rotateBookingSession } from './bookingSession';

function fingerprintOf(snapshot) {
  if (!snapshot) return '';
  return [
    snapshot.mobile,
    snapshot.name,
    snapshot.address,
    snapshot.city,
    snapshot.segment,
    snapshot.service,
    snapshot.package_id,
    snapshot.property_size,
    snapshot.property_type,
    snapshot.preferred_date,
    snapshot.preferred_time,
    snapshot.plan,
    snapshot.quantity,
    snapshot.estimated_price,
    snapshot.notes,
  ].join('|');
}

/**
 * PestControl-style capture: a valid 10-digit mobile creates the CRM lead
 * immediately. Later edits update that same session lead. Confirm Booking
 * should call flush() so the final details win.
 */
export function useDeepCleaningSilentLead(snapshot) {
  const snapshotRef = useRef(snapshot);
  const inFlightRef = useRef(false);
  const lastFingerprintRef = useRef('');
  const pendingRef = useRef(null);
  const stoppedRef = useRef(false);
  const abortRef = useRef(null);
  const prevMobileRef = useRef('');
  const queueRef = useRef(() => {});

  useEffect(() => {
    snapshotRef.current = snapshot;
  });

  useEffect(() => {
    rotateBookingSession();
    lastFingerprintRef.current = '';
    pendingRef.current = null;
    inFlightRef.current = false;
    stoppedRef.current = false;
  }, []);

  const queue = useCallback(() => {
    if (stoppedRef.current) return;
    const data = snapshotRef.current;
    if (!isValidBookingMobile(data?.mobile)) return;
    const fingerprint = fingerprintOf(data);
    if (fingerprint === lastFingerprintRef.current) return;
    if (inFlightRef.current) {
      pendingRef.current = data;
      return;
    }

    inFlightRef.current = true;
    pendingRef.current = null;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    abortRef.current = controller;
    const sentFingerprint = fingerprint;
    void upsertDeepCleaningInquiry(
      { ...data, booking_session_id: getBookingSessionId() },
      { silent: true, signal: controller?.signal },
    )
      .then((result) => {
        if (result && result.ok !== false && result.id) {
          lastFingerprintRef.current = sentFingerprint;
        }
      })
      .finally(() => {
        inFlightRef.current = false;
        if (stoppedRef.current) return;
        if (pendingRef.current) {
          pendingRef.current = null;
          queueRef.current();
        }
      });
  }, []);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const mobile = digitsOf(snapshot?.mobile);

  useEffect(() => {
    const previous = prevMobileRef.current;
    prevMobileRef.current = mobile;
    if (!previous) return;
    const cleared = isValidBookingMobile(previous) && mobile.length === 0;
    const replaced =
      isValidBookingMobile(previous) && isValidBookingMobile(mobile) && previous !== mobile;
    if (cleared || replaced) {
      rotateBookingSession();
      lastFingerprintRef.current = '';
      pendingRef.current = null;
    } else if (!isValidBookingMobile(mobile)) {
      lastFingerprintRef.current = '';
    }
  }, [mobile]);

  useEffect(() => {
    if (!isValidBookingMobile(mobile)) return undefined;
    const timer = window.setTimeout(() => queue(), 300);
    return () => window.clearTimeout(timer);
  }, [mobile, queue]);

  const fingerprint = fingerprintOf(snapshot);
  useEffect(() => {
    if (!isValidBookingMobile(mobile)) return undefined;
    const timer = window.setTimeout(() => queue(), 600);
    return () => window.clearTimeout(timer);
  }, [fingerprint, mobile, queue]);

  const flush = useCallback(async (extra = {}) => {
    stoppedRef.current = true;
    abortRef.current?.abort();
    const data = {
      ...snapshotRef.current,
      ...extra,
      booking_session_id: getBookingSessionId(),
    };
    return upsertDeepCleaningInquiry(data);
  }, []);

  return { flush };
}

function digitsOf(value) {
  return String(value || '').replace(/\D/g, '');
}
