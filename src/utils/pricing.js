import site from '../data/site';

export const money = (value) =>
  `₹${Math.round(value).toLocaleString('en-IN')}`;

export function findAmc(rateId) {
  return site.amc.find((item) => item.id === rateId) ?? null;
}

export function calcOneTime(rate, quantity) {
  const qty = Number(quantity);
  const base =
    rate.unit === 'package'
      ? rate.base
      : Math.max(rate.minimum, qty * rate.rate);
  const saving = Math.round(base * site.discount);
  return { base, saving, total: base - saving };
}

export function calcEstimate(rate, quantity, plan = 'one') {
  const amc = findAmc(rate.id);
  if (plan === 'amc' && amc) {
    return {
      base: rate.base * amc.visits,
      saving: Math.round(rate.base * site.discount),
      total: amc.annual,
      amc,
      scheduled: true,
    };
  }
  const one = calcOneTime(rate, quantity);
  return { ...one, amc, scheduled: false };
}

export function isQuantityOutOfRange(rate, quantity) {
  const qty = Number(quantity);
  const text = rate.package.replaceAll(',', '');
  const upto = text.match(/up to (\d+) sq ft/);
  const range = text.match(/(\d+)[–-](\d+) sq ft/);
  if (rate.unit !== 'sq ft') return false;
  if (upto && qty > Number(upto[1])) return true;
  if (range && (qty < Number(range[1]) || qty > Number(range[2]))) return true;
  return false;
}

export function ratesForService(service, segment = 'Residential') {
  return site.rates.filter(
    (rate) => rate.service === service && rate.segment === segment,
  );
}

export function findFullHomePackage(size, type) {
  return site.rates.find(
    (rate) =>
      rate.segment === 'Residential' &&
      rate.service === 'Full Home Deep Cleaning' &&
      rate.package.startsWith(`${type} ${size} `),
  );
}

export function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
