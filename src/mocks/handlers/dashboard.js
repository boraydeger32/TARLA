/**
 * MSW handlers for dashboard endpoints.
 * Serves aggregated stats, chart series, and recent activity.
 *
 * @module mocks/handlers/dashboard
 */

import { http, HttpResponse, delay } from 'msw';

import {
  dashboardStats,
  dashboardCharts,
  recentActivities,
} from '../fixtures/dashboard.js';

function simulateLatency() {
  return delay(Math.random() * 400 + 200);
}

export const dashboardHandlers = [
  http.get('*/api/v1/dashboard/stats', async () => {
    await simulateLatency();
    return HttpResponse.json(dashboardStats);
  }),

  http.get('*/api/v1/dashboard/charts', async () => {
    await simulateLatency();
    return HttpResponse.json(dashboardCharts);
  }),

  http.get('*/api/v1/dashboard/recent-activity', async ({ request }) => {
    await simulateLatency();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? 10);
    const items = recentActivities.slice(0, limit);
    return HttpResponse.json({
      items,
      total: recentActivities.length,
    });
  }),
];
