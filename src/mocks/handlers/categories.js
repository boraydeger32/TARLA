/**
 * MSW handlers for categories endpoints.
 * Simulates GET/POST/PATCH/DELETE /categories with pagination and filtering.
 * All handlers include 200-600ms simulated latency.
 *
 * Response shapes match FastAPI PaginatedResponse<T> exactly.
 * Error responses follow FastAPI format: { "detail": "..." }
 *
 * @module mocks/handlers/categories
 */

import { http, HttpResponse, delay } from 'msw';

import { categories, generateCategoryId } from '../fixtures/categories.js';

/**
 * Simulates realistic network latency (200-600ms).
 * @returns {Promise<void>}
 */
function simulateLatency() {
  return delay(Math.random() * 400 + 200);
}

/**
 * Mutable copy of categories for CRUD operations within the MSW session.
 * @type {import('@/models/Category.js').CategoryResponse[]}
 */
let categoriesData = [...categories];

/**
 * Filters categories based on query parameters.
 * @param {import('@/models/Category.js').CategoryResponse[]} data
 * @param {URLSearchParams} params
 * @returns {import('@/models/Category.js').CategoryResponse[]}
 */
function filterCategories(data, params) {
  let filtered = [...data];

  const search = params.get('search');
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name_tr.toLowerCase().includes(term) ||
        c.name_en.toLowerCase().includes(term) ||
        c.slug.toLowerCase().includes(term),
    );
  }

  const isActive = params.get('is_active');
  if (isActive !== null && isActive !== undefined && isActive !== '') {
    const active = isActive === 'true';
    filtered = filtered.filter((c) => c.is_active === active);
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
 * Categories MSW request handlers.
 * @type {import('msw').HttpHandler[]}
 */
export const categoriesHandlers = [
  /**
   * GET /categories — paginated list with filtering.
   * Query params: page, size, search, is_active, sort_by, sort_order
   */
  http.get('*/api/v1/categories', async ({ request }) => {
    await simulateLatency();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);

    const filtered = filterCategories(categoriesData, url.searchParams);
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
   * GET /categories/:id — single category detail.
   */
  http.get('*/api/v1/categories/:id', async ({ params }) => {
    await simulateLatency();

    const category = categoriesData.find((c) => c.id === params.id);

    if (!category) {
      return HttpResponse.json(
        { detail: 'Category not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(category);
  }),

  /**
   * POST /categories — create a new category.
   */
  http.post('*/api/v1/categories', async ({ request }) => {
    await simulateLatency();

    const body = await request.json();

    if (!body.name_tr || !body.name_en || !body.slug) {
      return HttpResponse.json(
        { detail: 'Missing required fields: name_tr, name_en, slug' },
        { status: 422 },
      );
    }

    const existing = categoriesData.find((c) => c.slug === body.slug);
    if (existing) {
      return HttpResponse.json(
        { detail: 'A category with this slug already exists' },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const newCategory = {
      id: generateCategoryId(),
      name_tr: body.name_tr,
      name_en: body.name_en,
      slug: body.slug,
      description_tr: body.description_tr ?? null,
      description_en: body.description_en ?? null,
      icon: body.icon ?? null,
      sort_order: body.sort_order ?? 0,
      is_active: body.is_active ?? true,
      listings_count: 0,
      created_at: now,
      updated_at: now,
    };

    categoriesData.unshift(newCategory);

    return HttpResponse.json(newCategory, { status: 201 });
  }),

  /**
   * PATCH /categories/:id — update an existing category.
   */
  http.patch('*/api/v1/categories/:id', async ({ params, request }) => {
    await simulateLatency();

    const index = categoriesData.findIndex((c) => c.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Category not found' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const updated = {
      ...categoriesData[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    categoriesData[index] = updated;

    return HttpResponse.json(updated);
  }),

  /**
   * DELETE /categories/:id — delete a category.
   */
  http.delete('*/api/v1/categories/:id', async ({ params }) => {
    await simulateLatency();

    const index = categoriesData.findIndex((c) => c.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Category not found' },
        { status: 404 },
      );
    }

    if (categoriesData[index].listings_count > 0) {
      return HttpResponse.json(
        { detail: 'Cannot delete category with active listings' },
        { status: 400 },
      );
    }

    categoriesData.splice(index, 1);

    return HttpResponse.json({ detail: 'Category deleted successfully' });
  }),
];
