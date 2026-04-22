/**
 * i18next bootstrap.
 * TR is default, EN is fallback. Namespaces loaded from static JSON imports so
 * Vite can bundle them without a backend plugin.
 *
 * @module i18n
 */

import i18next from 'i18next';

import dashboardTr from './locales/tr/dashboard.json';
import dashboardEn from './locales/en/dashboard.json';

export async function initI18n() {
  await i18next.init({
    lng: 'tr',
    fallbackLng: 'en',
    ns: ['dashboard'],
    defaultNS: 'dashboard',
    resources: {
      tr: { dashboard: dashboardTr },
      en: { dashboard: dashboardEn },
    },
    interpolation: { escapeValue: false },
  });
  return i18next;
}

export { i18next };
