/**
 * MSW handlers for locations endpoints.
 * Simulates GET/POST/PATCH/DELETE /locations with 3-tier hierarchy
 * (Province → District → Neighborhood) and lazy loading via parent_id.
 * All handlers include 200-600ms simulated latency.
 *
 * Response shapes match FastAPI PaginatedResponse<T> exactly.
 * Error responses follow FastAPI format: { "detail": "..." }
 *
 * @module mocks/handlers/locations
 */

import { http, HttpResponse, delay } from 'msw';

import { locations, generateLocationId } from '../fixtures/locations.js';

/**
 * Simulates realistic network latency (200-600ms).
 * @returns {Promise<void>}
 */
function simulateLatency() {
  return delay(Math.random() * 400 + 200);
}

/**
 * Mutable copy of locations for CRUD operations within the MSW session.
 * @type {import('@/models/Location.js').LocationResponse[]}
 */
let locationsData = [...locations];

/**
 * Filters locations based on query parameters.
 * @param {import('@/models/Location.js').LocationResponse[]} data
 * @param {URLSearchParams} params
 * @returns {import('@/models/Location.js').LocationResponse[]}
 */
function filterLocations(data, params) {
  let filtered = [...data];

  const level = params.get('level');
  if (level) {
    filtered = filtered.filter((l) => l.level === level);
  }

  const parentId = params.get('parent_id');
  if (parentId) {
    filtered = filtered.filter((l) => l.parent_id === parentId);
  } else if (parentId === null || params.get('root') === 'true') {
    filtered = filtered.filter((l) => l.parent_id === null);
  }

  const search = params.get('search');
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.name.toLowerCase().includes(term) ||
        l.full_path.toLowerCase().includes(term),
    );
  }

  const isActive = params.get('is_active');
  if (isActive !== null && isActive !== undefined && isActive !== '') {
    const active = isActive === 'true';
    filtered = filtered.filter((l) => l.is_active === active);
  }

  const sortBy = params.get('sort_by') ?? 'name';
  const sortOrder = params.get('sort_order') ?? 'asc';
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
 * Locations MSW request handlers.
 * @type {import('msw').HttpHandler[]}
 */
export const locationsHandlers = [
  /**
   * GET /locations — paginated list with filtering.
   * Query params: page, size, level, parent_id, root, search, is_active,
   *   sort_by, sort_order
   */
  http.get('*/api/v1/locations', async ({ request }) => {
    await simulateLatency();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);

    const filtered = filterLocations(locationsData, url.searchParams);
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
   * GET /locations/:id — single location detail.
   */
  http.get('*/api/v1/locations/:id', async ({ params }) => {
    await simulateLatency();

    const location = locationsData.find((l) => l.id === params.id);

    if (!location) {
      return HttpResponse.json(
        { detail: 'Location not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(location);
  }),

  /**
   * GET /locations/:id/children — children of a location (lazy loading).
   */
  http.get('*/api/v1/locations/:id/children', async ({ params, request }) => {
    await simulateLatency();

    const parent = locationsData.find((l) => l.id === params.id);

    if (!parent) {
      return HttpResponse.json(
        { detail: 'Location not found' },
        { status: 404 },
      );
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);

    const children = locationsData.filter((l) => l.parent_id === params.id);
    children.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

    const start = (page - 1) * size;
    const items = children.slice(start, start + size);

    return HttpResponse.json({
      items,
      total: children.length,
      page,
      size,
      pages: Math.ceil(children.length / size),
    });
  }),

  /**
   * POST /locations — create a new location.
   */
  http.post('*/api/v1/locations', async ({ request }) => {
    await simulateLatency();

    const body = await request.json();

    if (!body.name || !body.slug || !body.level) {
      return HttpResponse.json(
        { detail: 'Missing required fields: name, slug, level' },
        { status: 422 },
      );
    }

    const validLevels = ['province', 'district', 'neighborhood'];
    if (!validLevels.includes(body.level)) {
      return HttpResponse.json(
        { detail: 'Invalid level. Must be one of: province, district, neighborhood' },
        { status: 422 },
      );
    }

    if (body.level !== 'province' && !body.parent_id) {
      return HttpResponse.json(
        { detail: 'parent_id is required for district and neighborhood levels' },
        { status: 422 },
      );
    }

    if (body.parent_id) {
      const parent = locationsData.find((l) => l.id === body.parent_id);
      if (!parent) {
        return HttpResponse.json(
          { detail: 'Parent location not found' },
          { status: 404 },
        );
      }
    }

    const existing = locationsData.find(
      (l) => l.slug === body.slug && l.parent_id === (body.parent_id ?? null),
    );
    if (existing) {
      return HttpResponse.json(
        { detail: 'A location with this slug already exists at this level' },
        { status: 409 },
      );
    }

    let fullPath = body.name;
    if (body.parent_id) {
      const parent = locationsData.find((l) => l.id === body.parent_id);
      if (parent) {
        fullPath = `${parent.full_path} > ${body.name}`;
        parent.children_count += 1;
      }
    }

    const now = new Date().toISOString();
    const newLocation = {
      id: generateLocationId(),
      name: body.name,
      slug: body.slug,
      level: body.level,
      parent_id: body.parent_id ?? null,
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      is_active: body.is_active ?? true,
      full_path: fullPath,
      children_count: 0,
      listings_count: 0,
      created_at: now,
      updated_at: now,
    };

    locationsData.unshift(newLocation);

    return HttpResponse.json(newLocation, { status: 201 });
  }),

  /**
   * PATCH /locations/:id — update an existing location.
   */
  http.patch('*/api/v1/locations/:id', async ({ params, request }) => {
    await simulateLatency();

    const index = locationsData.findIndex((l) => l.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Location not found' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const updated = {
      ...locationsData[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    locationsData[index] = updated;

    return HttpResponse.json(updated);
  }),

  /**
   * DELETE /locations/:id — delete a location.
   */
  http.delete('*/api/v1/locations/:id', async ({ params }) => {
    await simulateLatency();

    const index = locationsData.findIndex((l) => l.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Location not found' },
        { status: 404 },
      );
    }

    if (locationsData[index].children_count > 0) {
      return HttpResponse.json(
        { detail: 'Cannot delete location with children. Remove children first.' },
        { status: 400 },
      );
    }

    if (locationsData[index].listings_count > 0) {
      return HttpResponse.json(
        { detail: 'Cannot delete location with active listings' },
        { status: 400 },
      );
    }

    const deleted = locationsData[index];
    locationsData.splice(index, 1);

    if (deleted.parent_id) {
      const parent = locationsData.find((l) => l.id === deleted.parent_id);
      if (parent) {
        parent.children_count = Math.max(0, parent.children_count - 1);
      }
    }

    return HttpResponse.json({ detail: 'Location deleted successfully' });
  }),
];
