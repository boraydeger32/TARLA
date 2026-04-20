/**
 * MSW handlers for logs endpoints.
 * Simulates GET /logs/audit and /logs/activity with pagination and filtering.
 * Logs are read-only (no POST/PATCH/DELETE from the admin panel).
 * All handlers include 200-600ms simulated latency.
 *
 * Response shapes match FastAPI PaginatedResponse<T> exactly.
 * Error responses follow FastAPI format: { "detail": "..." }
 *
 * @module mocks/handlers/logs
 */

import { http, HttpResponse, delay } from 'msw';

import { auditLogs, activityLogs } from '../fixtures/logs.js';

/**
 * Simulates realistic network latency (200-600ms).
 * @returns {Promise<void>}
 */
function simulateLatency() {
  return delay(Math.random() * 400 + 200);
}

/**
 * Filters audit logs based on query parameters.
 * @param {import('@/models/AuditLog.js').AuditLogResponse[]} data
 * @param {URLSearchParams} params
 * @returns {import('@/models/AuditLog.js').AuditLogResponse[]}
 */
function filterAuditLogs(data, params) {
  let filtered = [...data];

  const action = params.get('action');
  if (action) {
    filtered = filtered.filter((l) => l.action === action);
  }

  const entityType = params.get('entity_type');
  if (entityType) {
    filtered = filtered.filter((l) => l.entity_type === entityType);
  }

  const userId = params.get('user_id');
  if (userId) {
    filtered = filtered.filter((l) => l.user_id === userId);
  }

  const search = params.get('search');
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.action.toLowerCase().includes(term) ||
        (l.description && l.description.toLowerCase().includes(term)) ||
        l.entity_type.toLowerCase().includes(term),
    );
  }

  const dateFrom = params.get('date_from');
  if (dateFrom) {
    filtered = filtered.filter((l) => l.created_at >= dateFrom);
  }

  const dateTo = params.get('date_to');
  if (dateTo) {
    filtered = filtered.filter((l) => l.created_at <= dateTo);
  }

  const sortBy = params.get('sort_by') ?? 'created_at';
  const sortOrder = params.get('sort_order') ?? 'desc';
  filtered.sort((a, b) => {
    const aVal = a[sortBy] ?? '';
    const bVal = b[sortBy] ?? '';
    const cmp = String(aVal).localeCompare(String(bVal), 'tr');
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  return filtered;
}

/**
 * Filters activity logs based on query parameters.
 * @param {import('@/models/ActivityLog.js').ActivityLogResponse[]} data
 * @param {URLSearchParams} params
 * @returns {import('@/models/ActivityLog.js').ActivityLogResponse[]}
 */
function filterActivityLogs(data, params) {
  let filtered = [...data];

  const activityType = params.get('activity_type');
  if (activityType) {
    filtered = filtered.filter((l) => l.activity_type === activityType);
  }

  const userId = params.get('user_id');
  if (userId) {
    filtered = filtered.filter((l) => l.user_id === userId);
  }

  const search = params.get('search');
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.activity_type.toLowerCase().includes(term) ||
        (l.description && l.description.toLowerCase().includes(term)),
    );
  }

  const dateFrom = params.get('date_from');
  if (dateFrom) {
    filtered = filtered.filter((l) => l.created_at >= dateFrom);
  }

  const dateTo = params.get('date_to');
  if (dateTo) {
    filtered = filtered.filter((l) => l.created_at <= dateTo);
  }

  const sortBy = params.get('sort_by') ?? 'created_at';
  const sortOrder = params.get('sort_order') ?? 'desc';
  filtered.sort((a, b) => {
    const aVal = a[sortBy] ?? '';
    const bVal = b[sortBy] ?? '';
    const cmp = String(aVal).localeCompare(String(bVal), 'tr');
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  return filtered;
}

/**
 * Logs MSW request handlers.
 * @type {import('msw').HttpHandler[]}
 */
export const logsHandlers = [
  // ── Audit Logs ─────────────────────────────────────────────

  /**
   * GET /logs/audit — paginated audit log list.
   * Query params: page, size, action, entity_type, user_id, search,
   *   date_from, date_to, sort_by, sort_order
   */
  http.get('*/api/v1/logs/audit', async ({ request }) => {
    await simulateLatency();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);

    const filtered = filterAuditLogs(auditLogs, url.searchParams);
    const start = (page - 1) * size;
    const items = filtered.slice(start, start + size);

    return HttpResponse.json({
      items,
      total: filtered.length,
      page,
      size,
      pages: Math.ceil(filtered.length / size),
    });
  }),

  /**
   * GET /logs/audit/:id — single audit log detail.
   */
  http.get('*/api/v1/logs/audit/:id', async ({ params }) => {
    await simulateLatency();

    const log = auditLogs.find((l) => l.id === params.id);

    if (!log) {
      return HttpResponse.json(
        { detail: 'Audit log not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(log);
  }),

  // ── Activity Logs ──────────────────────────────────────────

  /**
   * GET /logs/activity — paginated activity log list.
   * Query params: page, size, activity_type, user_id, search,
   *   date_from, date_to, sort_by, sort_order
   */
  http.get('*/api/v1/logs/activity', async ({ request }) => {
    await simulateLatency();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);

    const filtered = filterActivityLogs(activityLogs, url.searchParams);
    const start = (page - 1) * size;
    const items = filtered.slice(start, start + size);

    return HttpResponse.json({
      items,
      total: filtered.length,
      page,
      size,
      pages: Math.ceil(filtered.length / size),
    });
  }),

  /**
   * GET /logs/activity/:id — single activity log detail.
   */
  http.get('*/api/v1/logs/activity/:id', async ({ params }) => {
    await simulateLatency();

    const log = activityLogs.find((l) => l.id === params.id);

    if (!log) {
      return HttpResponse.json(
        { detail: 'Activity log not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(log);
  }),
];
