/**
 * Aperant Admin Panel — application entry point.
 * Boots i18n + MSW + Alpine + layout shell with hash-based route switching.
 * Full Navigo router + Playwright tests arrive in Task 6.
 */

import Alpine from 'alpinejs';

import { registerChartFactories } from '@/components/charts/index.js';
import { initI18n } from '@/i18n/index.js';
import { registerI18nDirective } from '@/i18n/alpineDirective.js';
import { adminLayoutHtml } from '@/layouts/adminLayout.js';
import { adminLayoutData } from '@/layouts/adminLayoutData.js';
import { dashboardPage } from '@/views/dashboard/dashboard.js';

import '@/styles/main.css';

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS !== 'true') return;
  const { worker } = await import('@/mocks/browser.js');
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
  });
  console.info('[MSW] Mocking enabled');
}

function themeStore() {
  return {
    mode: localStorage.getItem('aperant.theme') ?? 'light',
    init() {
      document.documentElement.classList.toggle('dark', this.mode === 'dark');
    },
    toggle() {
      this.mode = this.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('aperant.theme', this.mode);
      document.documentElement.classList.toggle('dark', this.mode === 'dark');
    },
  };
}

async function boot() {
  await initI18n();
  await enableMocking();

  Alpine.store('theme', themeStore());
  registerI18nDirective(Alpine);
  registerChartFactories(Alpine);
  Alpine.data('adminLayout', adminLayoutData);
  Alpine.data('dashboardPage', dashboardPage);

  const root = document.getElementById('app');
  root.innerHTML = adminLayoutHtml();

  Alpine.start();
}

boot();
