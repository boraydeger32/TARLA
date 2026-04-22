/**
 * Service singletons re-export.
 * Import services from this barrel file throughout the application.
 *
 * @module services/index
 *
 * @example
 * import { listingsService, usersService } from '@/services/index.js';
 * const listings = await listingsService.list({ page: 1, size: 25 });
 */

export { authService } from './AuthService.js';
export { categoriesService } from './CategoriesService.js';
export { contentService } from './ContentService.js';
export { dashboardService } from './DashboardService.js';
export { listingsService } from './ListingsService.js';
export { locationsService } from './LocationsService.js';
export { logsService } from './LogsService.js';
export { moderationService } from './ModerationService.js';
export { packagesService } from './PackagesService.js';
export { reportsService } from './ReportsService.js';
export { settingsService } from './SettingsService.js';
export { transactionsService } from './TransactionsService.js';
export { usersService } from './UsersService.js';
