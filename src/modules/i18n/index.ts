import en from './locales/en.json';

export type Locale = 'en' | 'or' | 'hi';

const dictionaries: Record<Locale, typeof en> = {
  en,
  or: en, // Fallback to English for Odia scaffold
  hi: en, // Fallback to English for Hindi scaffold
};

export function getDictionary(locale: Locale = 'en') {
  return dictionaries[locale] || dictionaries.en;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}
