import { useSyncExternalStore } from 'react';
import site from './data/site';
import { apiBaseUrl } from './utils/api';

let catalog = site;
const listeners = new Set();

export function getCatalog() {
  return catalog;
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeCatalog(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCatalog() {
  return useSyncExternalStore(subscribeCatalog, getCatalog, getCatalog);
}

export function applyRemoteCatalog(payload) {
  if (!payload?.rates?.length) return;
  catalog = {
    ...site,
    discount: Number(payload.discount) > 0 ? Number(payload.discount) : site.discount,
    services: payload.services?.length ? payload.services : site.services,
    rates: payload.rates,
    amc: Array.isArray(payload.amc) ? payload.amc : site.amc,
  };
  emit();
}

export async function loadRemoteCatalog() {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer =
    controller && typeof window !== 'undefined'
      ? window.setTimeout(() => controller.abort(), 8000)
      : null;
  try {
    const response = await fetch(`${apiBaseUrl()}/deepcleaning-rates/catalog/`, {
      headers: { Accept: 'application/json' },
      signal: controller?.signal,
    });
    if (!response.ok) return;
    applyRemoteCatalog(await response.json());
  } catch {
    // The bundled sheet stays in place if the API is unreachable.
  } finally {
    if (timer) window.clearTimeout(timer);
  }
}
