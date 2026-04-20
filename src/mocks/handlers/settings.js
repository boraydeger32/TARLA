/**
 * MSW handlers for settings endpoints.
 * Simulates GET/POST/PATCH/DELETE /settings with group filtering.
 * All handlers include 200-600ms simulated latency.
 *
 * Response shapes match FastAPI PaginatedResponse<T> exactly.
 * Error responses follow FastAPI format: { "detail": "..." }
 *
 * @module mocks/handlers/settings
 */

import { http, HttpResponse, delay } from 'msw';

import { settings, generateSettingId } from '../fixtures/settings.js';

/**
 * Simulates realistic network latency (200-600ms).
 * @returns {Promise<void>}
 */
function simulateLatency() {
  return delay(Math.random() * 400 + 200);
}

/**
 * Mutable copy of settings for CRUD operations within the MSW session.
 * @type {import('@/models/Setting.js').SettingResponse[]}
 */
let settingsData = [...settings];

/**
 * Filters settings based on query parameters.
 * @param {import('@/models/Setting.js').SettingResponse[]} data
 * @param {URLSearchParams} params
 * @returns {import('@/models/Setting.js').SettingResponse[]}
 */
function filterSettings(data, params) {
  let filtered = [...data];

  const group = params.get('group');
  if (group) {
    filtered = filtered.filter((s) => s.group === group);
  }

  const isPublic = params.get('is_public');
  if (isPublic !== null && isPublic !== undefined && isPublic !== '') {
    const pub = isPublic === 'true';
    filtered = filtered.filter((s) => s.is_public === pub);
  }

  const search = params.get('search');
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.key.toLowerCase().includes(term) ||
        (s.label_tr && s.label_tr.toLowerCase().includes(term)) ||
        (s.label_en && s.label_en.toLowerCase().includes(term)),
    );
  }

  const sortBy = params.get('sort_by') ?? 'group';
  const sortOrder = params.get('sort_order') ?? 'asc';
  filtered.sort((a, b) => {
    const aVal = a[sortBy] ?? '';
    const bVal = b[sortBy] ?? '';
    const cmp = String(aVal).localeCompare(String(bVal), 'tr');
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  return filtered;
}

/**
 * Settings MSW request handlers.
 * @type {import('msw').HttpHandler[]}
 */
export const settingsHandlers = [
  /**
   * GET /settings — paginated list with filtering.
   * Query params: page, size, group, is_public, search, sort_by, sort_order
   */
  http.get('*/api/v1/settings', async ({ request }) => {
    await simulateLatency();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);

    const filtered = filterSettings(settingsData, url.searchParams);
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
   * GET /settings/:id — single setting detail.
   */
  http.get('*/api/v1/settings/:id', async ({ params }) => {
    await simulateLatency();

    const setting = settingsData.find((s) => s.id === params.id);

    if (!setting) {
      return HttpResponse.json(
        { detail: 'Setting not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(setting);
  }),

  /**
   * POST /settings — create a new setting.
   */
  http.post('*/api/v1/settings', async ({ request }) => {
    await simulateLatency();

    const body = await request.json();

    if (!body.key || body.value === undefined || !body.group || !body.value_type) {
      return HttpResponse.json(
        { detail: 'Missing required fields: key, value, group, value_type' },
        { status: 422 },
      );
    }

    const existing = settingsData.find((s) => s.key === body.key);
    if (existing) {
      return HttpResponse.json(
        { detail: 'A setting with this key already exists' },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const newSetting = {
      id: generateSettingId(),
      key: body.key,
      value: body.value,
      group: body.group,
      label_tr: body.label_tr ?? null,
      label_en: body.label_en ?? null,
      description_tr: body.description_tr ?? null,
      description_en: body.description_en ?? null,
      value_type: body.value_type,
      is_public: body.is_public ?? false,
      updated_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
      created_at: now,
      updated_at: now,
    };

    settingsData.unshift(newSetting);

    return HttpResponse.json(newSetting, { status: 201 });
  }),

  /**
   * PATCH /settings/:id — update a setting value.
   */
  http.patch('*/api/v1/settings/:id', async ({ params, request }) => {
    await simulateLatency();

    const index = settingsData.findIndex((s) => s.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Setting not found' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const updated = {
      ...settingsData[index],
      ...body,
      updated_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
      updated_at: new Date().toISOString(),
    };
    settingsData[index] = updated;

    return HttpResponse.json(updated);
  }),

  /**
   * DELETE /settings/:id — delete a setting.
   */
  http.delete('*/api/v1/settings/:id', async ({ params }) => {
    await simulateLatency();

    const index = settingsData.findIndex((s) => s.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Setting not found' },
        { status: 404 },
      );
    }

    settingsData.splice(index, 1);

    return HttpResponse.json({ detail: 'Setting deleted successfully' });
  }),
];
