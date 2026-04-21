/**
 * Dashboard query observer factories.
 * Provides reactive observers for dashboard stats, charts, and recent activity.
 * All endpoints are read-only; no mutation helpers needed.
 *
 * @module queries/dashboardQueries
 */

import { QueryObserver } from '@tanstack/query-core';

import { dashboardService } from '@/services/DashboardService.js';

import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';

/**
 * Creates a QueryObserver for dashboard stat card data.
 *
 * @returns {QueryObserver} Observer that emits aggregated stat data
 *
 * @example
 * const observer = dashboardStatsObserver();
 * const unsub = observer.subscribe((result) => {
 *   console.log(result.data?.active_listings);
 * });
 */
export function dashboardStatsObserver() {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => dashboardService.getStats(),
  });
}

/**
 * Creates a QueryObserver for dashboard chart series data.
 *
 * @param {string} [period='last_6m'] - Time period filter
 * @returns {QueryObserver} Observer that emits chart data for all 4 charts
 *
 * @example
 * const observer = dashboardChartsObserver('last_6m');
 * const unsub = observer.subscribe((result) => {
 *   console.log(result.data?.listings_over_time);
 * });
 */
export function dashboardChartsObserver(period = 'last_6m') {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.dashboard.charts(period),
    queryFn: () => dashboardService.getCharts({ period }),
  });
}

/**
 * Creates a QueryObserver for the recent activity feed.
 *
 * @param {number} [limit=10] - Number of activity items to fetch
 * @returns {QueryObserver} Observer that emits recent activity items
 *
 * @example
 * const observer = dashboardRecentActivityObserver();
 * const unsub = observer.subscribe((result) => {
 *   console.log(result.data?.items);
 * });
 */
export function dashboardRecentActivityObserver(limit = 10) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.dashboard.recentActivity(),
    queryFn: () => dashboardService.getRecentActivity({ limit }),
  });
}
