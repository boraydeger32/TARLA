/**
 * Alpine data factory for the admin layout shell.
 * Handles sidebar panel state, active module/route tracking, and hash-based
 * route changes.
 *
 * @module layouts/adminLayoutData
 */

import Alpine from 'alpinejs';

import { resolveRoute } from '@/router/routes.js';

const DEFAULT_ROUTE = 'dashboard';

function currentHashSlug() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  return raw || DEFAULT_ROUTE;
}

export function adminLayoutData() {
  return {
    sidebarPanelOpen: true,
    activeModule: 'dashboard',
    activeRoute: 'dashboard',

    init() {
      this._applyRoute(currentHashSlug());
      window.addEventListener('hashchange', () => this._applyRoute(currentHashSlug()));
    },

    navigate(slug) {
      window.location.hash = `/${slug}`;
    },

    setActiveModule(moduleSlug) {
      this.activeModule = moduleSlug;
      this.sidebarPanelOpen = true;
    },

    _applyRoute(slug) {
      const route = resolveRoute(slug);
      this.activeRoute = slug;
      this.activeModule = route.module;
      const outlet = document.getElementById('route-outlet');
      if (outlet) {
        outlet.innerHTML = `
          <div class="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Admin</span>
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            <span class="font-medium text-gray-900 dark:text-white">${route.title}</span>
          </div>
          ${route.html}
        `;
        queueMicrotask(() => Alpine.initTree(outlet));
      }
    },
  };
}
