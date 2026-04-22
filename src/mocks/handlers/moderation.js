/**
 * MSW handlers for moderation endpoints.
 * Aggregates pending reports and listings into a moderation queue.
 * All handlers include 200-600ms simulated latency.
 *
 * Response shapes match FastAPI PaginatedResponse<T> exactly.
 * Error responses follow FastAPI format: { "detail": "..." }
 *
 * @module mocks/handlers/moderation
 */

import { http, HttpResponse, delay } from 'msw';

import { reports } from '../fixtures/reports.js';
import { listings } from '../fixtures/listings.js';

/**
 * Simulates realistic network latency (200-600ms).
 * @returns {Promise<void>}
 */
function simulateLatency() {
  return delay(Math.random() * 400 + 200);
}

/**
 * Moderation MSW request handlers.
 * @type {import('msw').HttpHandler[]}
 */
export const moderationHandlers = [
  /**
   * GET /moderation — paginated moderation queue.
   * Returns combined pending reports and pending listings.
   * Query params: page, size, type (report|listing|all), search, sort_by, sort_order
   */
  http.get('*/api/v1/moderation', async ({ request }) => {
    await simulateLatency();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
    const type = url.searchParams.get('type') ?? 'all';
    const search = url.searchParams.get('search');

    let items = [];

    if (type === 'all' || type === 'report') {
      const pendingReports = reports
        .filter((r) => r.status === 'pending')
        .map((r) => ({
          id: r.id,
          type: 'report',
          title: r.reason,
          description: r.description,
          status: r.status,
          reporter: r.reporter,
          target_type: r.target_type,
          target_id: r.target_id,
          target: r.target,
          created_at: r.created_at,
        }));
      items = items.concat(pendingReports);
    }

    if (type === 'all' || type === 'listing') {
      const pendingListings = listings
        .filter((l) => l.status === 'pending')
        .map((l) => ({
          id: l.id,
          type: 'listing',
          title: l.title,
          description: l.description,
          status: l.status,
          reporter: null,
          target_type: 'listing',
          target_id: l.id,
          target: { id: l.id, title: l.title },
          created_at: l.created_at,
        }));
      items = items.concat(pendingListings);
    }

    if (search) {
      const term = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          (item.description && item.description.toLowerCase().includes(term)),
      );
    }

    const sortBy = url.searchParams.get('sort_by') ?? 'created_at';
    const sortOrder = url.searchParams.get('sort_order') ?? 'desc';
    items.sort((a, b) => {
      const aVal = a[sortBy] ?? '';
      const bVal = b[sortBy] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), 'tr');
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    const total = items.length;
    const start = (page - 1) * size;
    const paged = items.slice(start, start + size);

    return HttpResponse.json({
      items: paged,
      total,
      page,
      size,
      pages: Math.ceil(total / size),
    });
  }),

  /**
   * GET /moderation/stats — moderation queue statistics.
   */
  http.get('*/api/v1/moderation/stats', async () => {
    await simulateLatency();

    const pendingReports = reports.filter((r) => r.status === 'pending').length;
    const reviewedReports = reports.filter((r) => r.status === 'reviewed').length;
    const pendingListings = listings.filter((l) => l.status === 'pending').length;
    const totalReports = reports.length;

    return HttpResponse.json({
      pending_reports: pendingReports,
      reviewed_reports: reviewedReports,
      pending_listings: pendingListings,
      total_reports: totalReports,
      total_queue: pendingReports + pendingListings,
    });
  }),
];
