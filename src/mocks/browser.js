/**
 * MSW browser worker setup.
 * Configures the service worker with all domain-specific request handlers.
 *
 * Handlers are spread into setupWorker — each domain module exports an array
 * of `http.*` handlers (e.g., listingsHandlers, authHandlers). As new handler
 * files are created (subtasks 4-2 through 4-5), import and spread them here.
 *
 * @module mocks/browser
 * @see {@link https://mswjs.io/docs/api/setup-worker}
 */

import { setupWorker } from 'msw/browser';

import { authHandlers } from './handlers/auth.js';
import { dashboardHandlers } from './handlers/dashboard.js';
import { listingsHandlers } from './handlers/listings.js';
import { usersHandlers } from './handlers/users.js';
import { categoriesHandlers } from './handlers/categories.js';
import { locationsHandlers } from './handlers/locations.js';
import { reportsHandlers } from './handlers/reports.js';
import { moderationHandlers } from './handlers/moderation.js';
import { packagesHandlers } from './handlers/packages.js';
import { transactionsHandlers } from './handlers/transactions.js';
import { contentHandlers } from './handlers/content.js';
import { settingsHandlers } from './handlers/settings.js';
import { logsHandlers } from './handlers/logs.js';

/**
 * Aggregated array of all MSW request handlers.
 * Import and spread domain handler arrays here as they are created.
 *
 * @type {import('msw').HttpHandler[]}
 */
const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...listingsHandlers,
  ...usersHandlers,
  ...categoriesHandlers,
  ...locationsHandlers,
  ...reportsHandlers,
  ...moderationHandlers,
  ...packagesHandlers,
  ...transactionsHandlers,
  ...contentHandlers,
  ...settingsHandlers,
  ...logsHandlers,
];

/**
 * MSW browser service worker instance.
 * Started conditionally in src/main.js when VITE_USE_MOCKS=true.
 *
 * @type {import('msw/browser').SetupWorker}
 */
export const worker = setupWorker(...handlers);
