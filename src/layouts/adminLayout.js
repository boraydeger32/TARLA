/**
 * Admin layout shell: Sidebar 1 (icon rail) + Sidebar 2 (collapsible panel)
 * + sticky header + main content + footer. Hash-based routing swaps the
 * content in the main slot. Full Navigo integration lands in Task 6.
 *
 * @module layouts/adminLayout
 */

import { MODULES } from './modules.js';

/**
 * Returns the root admin layout HTML.
 * @returns {string}
 */
export function adminLayoutHtml() {
  const rail = MODULES.map(
    (m) => `
    <button
      type="button"
      @click="setActiveModule('${m.slug}')"
      :class="activeModule === '${m.slug}' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'"
      class="group relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors"
      title="${m.label}"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="${m.icon}" />
      </svg>
      <span class="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-gray-700">
        ${m.label}
      </span>
    </button>`,
  ).join('\n');

  const panels = MODULES.map(
    (m) => `
    <div x-show="activeModule === '${m.slug}'" x-transition.opacity>
      <p class="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">${m.label}</p>
      <nav class="space-y-1">
        ${m.subLinks
          .map(
            (l) => `
        <a
          href="#/${l.slug}"
          @click.prevent="navigate('${l.slug}')"
          :class="activeRoute === '${l.slug}' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
          class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        >
          <span>${l.label}</span>
          ${l.badge ? `<span class="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">${l.badge}</span>` : ''}
        </a>`,
          )
          .join('')}
      </nav>
    </div>`,
  ).join('\n');

  return `
  <div x-data="adminLayout" x-init="init()" x-cloak class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- ── Web Header ── -->
    <header class="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-16 items-center justify-between px-4 lg:px-6">
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="sidebarPanelOpen = !sidebarPanelOpen"
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Kenar çubuğunu aç/kapat"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <a href="#/dashboard" @click.prevent="navigate('dashboard')" class="flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 font-bold text-white">A</div>
            <div class="hidden sm:block">
              <p class="text-base font-semibold leading-tight text-gray-900 dark:text-white">Aperant</p>
              <p class="text-xs leading-tight text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          </a>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Bildirimler"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
          </button>
          <button
            type="button"
            @click="$store.theme.toggle()"
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Tema"
          >
            <svg x-show="$store.theme.mode === 'light'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
            <svg x-show="$store.theme.mode === 'dark'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          </button>
          <div class="ml-2 flex items-center gap-3 border-l border-gray-200 pl-3 dark:border-gray-800">
            <div class="hidden text-right sm:block">
              <p class="text-sm font-medium text-gray-900 dark:text-white">Ahmet Yılmaz</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Süper Admin</p>
            </div>
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-semibold text-white">AY</div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- ── Sidebar 1 (icon rail) ── -->
      <aside class="sticky top-16 hidden h-[calc(100vh-4rem)] w-16 flex-col items-center gap-1 border-r border-gray-200 bg-white py-4 md:flex dark:border-gray-800 dark:bg-gray-900">
        ${rail}
        <div class="mt-auto"></div>
      </aside>

      <!-- ── Sidebar 2 (collapsible panel) ── -->
      <aside
        class="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden border-r border-gray-200 bg-white transition-[width] duration-300 md:block dark:border-gray-800 dark:bg-gray-900"
        :class="sidebarPanelOpen ? 'md:w-64' : 'md:w-0'"
      >
        <div class="w-64 p-4">
          ${panels}
        </div>
      </aside>

      <!-- ── Main Content ── -->
      <main id="route-outlet" class="min-h-[calc(100vh-4rem)] flex-1 px-4 py-6 lg:px-8"></main>
    </div>

    <footer class="border-t border-gray-200 bg-white px-4 py-4 text-center text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
      Aperant Admin v0.1.0 &middot; © 2026 Aperant
    </footer>
  </div>`;
}
