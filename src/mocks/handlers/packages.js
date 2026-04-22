/**
 * MSW handlers for packages endpoints.
 * Simulates GET/POST/PATCH/DELETE /packages with pagination and filtering.
 * All handlers include 200-600ms simulated latency.
 *
 * Response shapes match FastAPI PaginatedResponse<T> exactly.
 * Error responses follow FastAPI format: { "detail": "..." }
 *
 * @module mocks/handlers/packages
 */

import { http, HttpResponse, delay } from 'msw';

import { packages, generatePackageId } from '../fixtures/packages.js';

/**
 * Simulates realistic network latency (200-600ms).
 * @returns {Promise<void>}
 */
function simulateLatency() {
  return delay(Math.random() * 400 + 200);
}

/**
 * Mutable copy of packages for CRUD operations within the MSW session.
 * @type {import('@/models/Package.js').PackageResponse[]}
 */
let packagesData = [...packages];

/**
 * Filters packages based on query parameters.
 * @param {import('@/models/Package.js').PackageResponse[]} data
 * @param {URLSearchParams} params
 * @returns {import('@/models/Package.js').PackageResponse[]}
 */
function filterPackages(data, params) {
  let filtered = [...data];

  const search = params.get('search');
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name_tr.toLowerCase().includes(term) ||
        p.name_en.toLowerCase().includes(term),
    );
  }

  const isActive = params.get('is_active');
  if (isActive !== null && isActive !== undefined && isActive !== '') {
    const active = isActive === 'true';
    filtered = filtered.filter((p) => p.is_active === active);
  }

  const sortBy = params.get('sort_by') ?? 'sort_order';
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
 * Packages MSW request handlers.
 * @type {import('msw').HttpHandler[]}
 */
export const packagesHandlers = [
  /**
   * GET /packages — paginated list with filtering.
   * Query params: page, size, search, is_active, sort_by, sort_order
   */
  http.get('*/api/v1/packages', async ({ request }) => {
    await simulateLatency();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);

    const filtered = filterPackages(packagesData, url.searchParams);
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
   * GET /packages/:id — single package detail.
   */
  http.get('*/api/v1/packages/:id', async ({ params }) => {
    await simulateLatency();

    const pkg = packagesData.find((p) => p.id === params.id);

    if (!pkg) {
      return HttpResponse.json(
        { detail: 'Package not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(pkg);
  }),

  /**
   * POST /packages — create a new package.
   */
  http.post('*/api/v1/packages', async ({ request }) => {
    await simulateLatency();

    const body = await request.json();

    if (!body.name_tr || !body.name_en || body.price === undefined || !body.duration_days) {
      return HttpResponse.json(
        { detail: 'Missing required fields: name_tr, name_en, price, duration_days' },
        { status: 422 },
      );
    }

    const now = new Date().toISOString();
    const newPackage = {
      id: generatePackageId(),
      name_tr: body.name_tr,
      name_en: body.name_en,
      description_tr: body.description_tr ?? null,
      description_en: body.description_en ?? null,
      price: body.price,
      currency: body.currency ?? 'TRY',
      duration_days: body.duration_days,
      features: body.features ?? [],
      is_active: body.is_active ?? true,
      sort_order: body.sort_order ?? 0,
      subscribers_count: 0,
      created_at: now,
      updated_at: now,
    };

    packagesData.unshift(newPackage);

    return HttpResponse.json(newPackage, { status: 201 });
  }),

  /**
   * PATCH /packages/:id — update an existing package.
   */
  http.patch('*/api/v1/packages/:id', async ({ params, request }) => {
    await simulateLatency();

    const index = packagesData.findIndex((p) => p.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Package not found' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const updated = {
      ...packagesData[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    packagesData[index] = updated;

    return HttpResponse.json(updated);
  }),

  /**
   * DELETE /packages/:id — delete a package.
   */
  http.delete('*/api/v1/packages/:id', async ({ params }) => {
    await simulateLatency();

    const index = packagesData.findIndex((p) => p.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Package not found' },
        { status: 404 },
      );
    }

    if (packagesData[index].subscribers_count > 0) {
      return HttpResponse.json(
        { detail: 'Cannot delete package with active subscribers' },
        { status: 400 },
      );
    }

    packagesData.splice(index, 1);

    return HttpResponse.json({ detail: 'Package deleted successfully' });
  }),
];
