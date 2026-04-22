/**
 * Dashboard service — fetches aggregated stats, chart data, and activity feed.
 * Unlike CRUD services, dashboard endpoints return custom shapes.
 *
 * @module services/DashboardService
 */

import { apiClient } from '@/api/client.js';

/**
 * Service for dashboard-specific API endpoints.
 * Does not extend BaseService because the endpoints are read-only aggregations,
 * not standard CRUD resources.
 */
class DashboardService {
  constructor() {
    this.client = apiClient;
  }

  /**
   * Fetches aggregated stat card data.
   * @returns {Promise<{
   *   active_listings: { value: number, change: number },
   *   pending_count: { value: number, change: number },
   *   total_users: { value: number, change: number },
   *   revenue: { value: number, change: number, currency: string }
   * }>}
   */
  getStats() {
    return this.client.get('/dashboard/stats');
  }

  /**
   * Fetches chart series data for all 4 dashboard charts.
   * @param {Record<string, unknown>} [params] - Query params (period: last_30d|last_90d|last_6m|last_1y)
   * @returns {Promise<{
   *   listings_over_time: { labels: string[], series: { name: string, data: number[] }[] },
   *   revenue_by_month: { labels: string[], series: { name: string, data: number[] }[] },
   *   listings_by_category: { labels: string[], series: number[] },
   *   user_growth: { labels: string[], series: { name: string, data: number[] }[] }
   * }>}
   */
  getCharts(params) {
    return this.client.get('/dashboard/charts', { params });
  }

  /**
   * Fetches recent activity feed items.
   * @param {Record<string, unknown>} [params] - Query params (limit)
   * @returns {Promise<{ items: Array<object>, total: number }>}
   */
  getRecentActivity(params) {
    return this.client.get('/dashboard/recent-activity', { params });
  }
}

/** Singleton DashboardService instance. */
export const dashboardService = new DashboardService();
