/**
 * MSW handlers for reports endpoints.
 * Simulates GET/POST/PATCH /reports with pagination, filtering,
 * and review/dismiss/action workflows.
 * All handlers include 200-600ms simulated latency.
 *
 * Response shapes match FastAPI PaginatedResponse<T> exactly.
 * Error responses follow FastAPI format: { "detail": "..." }
 *
 * @module mocks/handlers/reports
 */

import { http, HttpResponse, delay } from 'msw';

import { reports, generateReportId } from '../fixtures/reports.js';

/**
 * Simulates realistic network latency (200-600ms).
 * @returns {Promise<void>}
 */
function simulateLatency() {
  return delay(Math.random() * 400 + 200);
}

/**
 * Mutable copy of reports for CRUD operations within the MSW session.
 * @type {import('@/models/Report.js').ReportResponse[]}
 */
let reportsData = [...reports];

/**
 * Filters reports based on query parameters.
 * @param {import('@/models/Report.js').ReportResponse[]} data
 * @param {URLSearchParams} params
 * @returns {import('@/models/Report.js').ReportResponse[]}
 */
function filterReports(data, params) {
  let filtered = [...data];

  const status = params.get('status');
  if (status && status !== 'all') {
    filtered = filtered.filter((r) => r.status === status);
  }

  const targetType = params.get('target_type');
  if (targetType) {
    filtered = filtered.filter((r) => r.target_type === targetType);
  }

  const search = params.get('search');
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.reason.toLowerCase().includes(term) ||
        (r.description && r.description.toLowerCase().includes(term)),
    );
  }

  const sortBy = params.get('sort_by') ?? 'created_at';
  const sortOrder = params.get('sort_order') ?? 'desc';
  filtered.sort((a, b) => {
    const aVal = a[sortBy] ?? '';
    const bVal = b[sortBy] ?? '';
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    const cmp = String(aVal).localeCompare(String(bVal), 'tr');
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  return filtered;
}

/**
 * Reports MSW request handlers.
 * @type {import('msw').HttpHandler[]}
 */
export const reportsHandlers = [
  /**
   * GET /reports — paginated list with filtering.
   * Query params: page, size, status, target_type, search, sort_by, sort_order
   */
  http.get('*/api/v1/reports', async ({ request }) => {
    await simulateLatency();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);

    const filtered = filterReports(reportsData, url.searchParams);
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
   * GET /reports/:id — single report detail.
   */
  http.get('*/api/v1/reports/:id', async ({ params }) => {
    await simulateLatency();

    const report = reportsData.find((r) => r.id === params.id);

    if (!report) {
      return HttpResponse.json(
        { detail: 'Report not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(report);
  }),

  /**
   * POST /reports — create a new report.
   */
  http.post('*/api/v1/reports', async ({ request }) => {
    await simulateLatency();

    const body = await request.json();

    if (!body.reason || !body.target_type || !body.target_id) {
      return HttpResponse.json(
        { detail: 'Missing required fields: reason, target_type, target_id' },
        { status: 422 },
      );
    }

    const now = new Date().toISOString();
    const newReport = {
      id: generateReportId(),
      reason: body.reason,
      description: body.description ?? null,
      target_type: body.target_type,
      target_id: body.target_id,
      status: 'pending',
      reporter_id: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
      reporter: { id: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z', first_name: 'Ahmet', last_name: 'Yılmaz' },
      target: null,
      resolution_note: null,
      action_taken: null,
      reviewed_by: null,
      reviewed_at: null,
      created_at: now,
      updated_at: now,
    };

    reportsData.unshift(newReport);

    return HttpResponse.json(newReport, { status: 201 });
  }),

  /**
   * POST /reports/:id/review — mark a report as reviewed.
   */
  http.post('*/api/v1/reports/:id/review', async ({ params, request }) => {
    await simulateLatency();

    const index = reportsData.findIndex((r) => r.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Report not found' },
        { status: 404 },
      );
    }

    if (reportsData[index].status !== 'pending') {
      return HttpResponse.json(
        { detail: 'Only pending reports can be reviewed' },
        { status: 400 },
      );
    }

    const body = await request.json();
    const now = new Date().toISOString();
    reportsData[index] = {
      ...reportsData[index],
      status: 'reviewed',
      resolution_note: body.resolution_note ?? null,
      reviewed_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
      reviewed_at: now,
      updated_at: now,
    };

    return HttpResponse.json(reportsData[index]);
  }),

  /**
   * POST /reports/:id/dismiss — dismiss a report.
   */
  http.post('*/api/v1/reports/:id/dismiss', async ({ params, request }) => {
    await simulateLatency();

    const index = reportsData.findIndex((r) => r.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Report not found' },
        { status: 404 },
      );
    }

    if (reportsData[index].status !== 'pending' && reportsData[index].status !== 'reviewed') {
      return HttpResponse.json(
        { detail: 'Only pending or reviewed reports can be dismissed' },
        { status: 400 },
      );
    }

    const body = await request.json();
    const now = new Date().toISOString();
    reportsData[index] = {
      ...reportsData[index],
      status: 'dismissed',
      resolution_note: body.resolution_note ?? 'Rapor reddedildi.',
      reviewed_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
      reviewed_at: now,
      updated_at: now,
    };

    return HttpResponse.json(reportsData[index]);
  }),

  /**
   * POST /reports/:id/action — take action on a report.
   */
  http.post('*/api/v1/reports/:id/action', async ({ params, request }) => {
    await simulateLatency();

    const index = reportsData.findIndex((r) => r.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Report not found' },
        { status: 404 },
      );
    }

    if (reportsData[index].status !== 'pending' && reportsData[index].status !== 'reviewed') {
      return HttpResponse.json(
        { detail: 'Only pending or reviewed reports can be actioned' },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (!body.action_taken) {
      return HttpResponse.json(
        { detail: 'action_taken is required' },
        { status: 422 },
      );
    }

    const now = new Date().toISOString();
    reportsData[index] = {
      ...reportsData[index],
      status: 'actioned',
      resolution_note: body.resolution_note ?? null,
      action_taken: body.action_taken,
      reviewed_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
      reviewed_at: now,
      updated_at: now,
    };

    return HttpResponse.json(reportsData[index]);
  }),
];
