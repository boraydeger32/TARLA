/**
 * MSW handlers for listings endpoints.
 * Simulates GET/POST/PATCH/DELETE /listings with pagination, filtering,
 * and special actions (approve, reject, feature).
 * All handlers include 200-600ms simulated latency.
 *
 * Response shapes match FastAPI PaginatedResponse<T> exactly.
 * Error responses follow FastAPI format: { "detail": "..." }
 *
 * @module mocks/handlers/listings
 */

import { http, HttpResponse, delay } from 'msw';

import { listings, generateListingId } from '../fixtures/listings.js';

/**
 * Simulates realistic network latency (200-600ms).
 * @returns {Promise<void>}
 */
function simulateLatency() {
  return delay(Math.random() * 400 + 200);
}

/**
 * Mutable copy of listings for CRUD operations within the MSW session.
 * Reset on page reload (MSW re-initializes).
 * @type {import('@/models/Listing.js').ListingResponse[]}
 */
let listingsData = [...listings];

/**
 * Filters listings based on query parameters.
 * @param {import('@/models/Listing.js').ListingResponse[]} data
 * @param {URLSearchParams} params
 * @returns {import('@/models/Listing.js').ListingResponse[]}
 */
function filterListings(data, params) {
  let filtered = [...data];

  const status = params.get('status');
  if (status && status !== 'all') {
    filtered = filtered.filter((l) => l.status === status);
  }

  const search = params.get('search');
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(term) ||
        l.description.toLowerCase().includes(term),
    );
  }

  const categoryId = params.get('category_id');
  if (categoryId) {
    filtered = filtered.filter((l) => l.category_id === categoryId);
  }

  const locationId = params.get('location_id');
  if (locationId) {
    filtered = filtered.filter((l) => l.location_id === locationId);
  }

  const zoningStatus = params.get('zoning_status');
  if (zoningStatus) {
    filtered = filtered.filter((l) => l.zoning_status === zoningStatus);
  }

  const minPrice = params.get('min_price');
  if (minPrice) {
    filtered = filtered.filter((l) => l.price >= Number(minPrice));
  }

  const maxPrice = params.get('max_price');
  if (maxPrice) {
    filtered = filtered.filter((l) => l.price <= Number(maxPrice));
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
 * Listings MSW request handlers.
 * @type {import('msw').HttpHandler[]}
 */
export const listingsHandlers = [
  /**
   * GET /listings — paginated list with filtering.
   * Query params: page, size, status, search, category_id, location_id,
   *   zoning_status, min_price, max_price, sort_by, sort_order
   */
  http.get('*/api/v1/listings', async ({ request }) => {
    await simulateLatency();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);

    const filtered = filterListings(listingsData, url.searchParams);
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
   * GET /listings/:id — single listing detail.
   */
  http.get('*/api/v1/listings/:id', async ({ params }) => {
    await simulateLatency();

    const listing = listingsData.find((l) => l.id === params.id);

    if (!listing) {
      return HttpResponse.json(
        { detail: 'Listing not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(listing);
  }),

  /**
   * POST /listings — create a new listing.
   */
  http.post('*/api/v1/listings', async ({ request }) => {
    await simulateLatency();

    const body = await request.json();

    if (!body.title || !body.price || !body.category_id || !body.location_id) {
      return HttpResponse.json(
        { detail: 'Missing required fields: title, price, category_id, location_id' },
        { status: 422 },
      );
    }

    const now = new Date().toISOString();
    const newListing = {
      id: generateListingId(),
      title: body.title,
      description: body.description ?? '',
      price: body.price,
      currency: body.currency ?? 'TRY',
      category_id: body.category_id,
      location_id: body.location_id,
      area_m2: body.area_m2 ?? 0,
      zoning_status: body.zoning_status ?? 'none',
      parcel_no: body.parcel_no ?? null,
      island_no: body.island_no ?? null,
      deed_type: body.deed_type ?? null,
      is_featured: false,
      status: 'draft',
      owner_id: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
      owner: { id: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z', first_name: 'Ahmet', last_name: 'Yılmaz' },
      view_count: 0,
      favorite_count: 0,
      media: [],
      location: null,
      category: null,
      rejection_reason: null,
      featured_until: null,
      created_at: now,
      updated_at: now,
      approved_at: null,
      approved_by: null,
    };

    listingsData.unshift(newListing);

    return HttpResponse.json(newListing, { status: 201 });
  }),

  /**
   * PATCH /listings/:id — update an existing listing.
   */
  http.patch('*/api/v1/listings/:id', async ({ params, request }) => {
    await simulateLatency();

    const index = listingsData.findIndex((l) => l.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Listing not found' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const updated = {
      ...listingsData[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    listingsData[index] = updated;

    return HttpResponse.json(updated);
  }),

  /**
   * DELETE /listings/:id — delete a listing.
   */
  http.delete('*/api/v1/listings/:id', async ({ params }) => {
    await simulateLatency();

    const index = listingsData.findIndex((l) => l.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Listing not found' },
        { status: 404 },
      );
    }

    listingsData.splice(index, 1);

    return HttpResponse.json({ detail: 'Listing deleted successfully' });
  }),

  /**
   * POST /listings/:id/approve — approve a pending listing.
   */
  http.post('*/api/v1/listings/:id/approve', async ({ params }) => {
    await simulateLatency();

    const index = listingsData.findIndex((l) => l.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Listing not found' },
        { status: 404 },
      );
    }

    if (listingsData[index].status !== 'pending') {
      return HttpResponse.json(
        { detail: 'Only pending listings can be approved' },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    listingsData[index] = {
      ...listingsData[index],
      status: 'active',
      approved_at: now,
      approved_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
      updated_at: now,
    };

    return HttpResponse.json(listingsData[index]);
  }),

  /**
   * POST /listings/:id/reject — reject a pending listing with a reason.
   */
  http.post('*/api/v1/listings/:id/reject', async ({ params, request }) => {
    await simulateLatency();

    const index = listingsData.findIndex((l) => l.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Listing not found' },
        { status: 404 },
      );
    }

    if (listingsData[index].status !== 'pending') {
      return HttpResponse.json(
        { detail: 'Only pending listings can be rejected' },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (!body.reason) {
      return HttpResponse.json(
        { detail: 'Rejection reason is required' },
        { status: 422 },
      );
    }

    const now = new Date().toISOString();
    listingsData[index] = {
      ...listingsData[index],
      status: 'rejected',
      rejection_reason: body.reason,
      updated_at: now,
    };

    return HttpResponse.json(listingsData[index]);
  }),

  /**
   * POST /listings/:id/feature — feature a listing for a given duration.
   */
  http.post('*/api/v1/listings/:id/feature', async ({ params, request }) => {
    await simulateLatency();

    const index = listingsData.findIndex((l) => l.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Listing not found' },
        { status: 404 },
      );
    }

    if (listingsData[index].status !== 'active') {
      return HttpResponse.json(
        { detail: 'Only active listings can be featured' },
        { status: 400 },
      );
    }

    const body = await request.json();
    const durationDays = body.duration_days ?? 30;

    const featuredUntil = new Date();
    featuredUntil.setDate(featuredUntil.getDate() + durationDays);

    const now = new Date().toISOString();
    listingsData[index] = {
      ...listingsData[index],
      is_featured: true,
      featured_until: featuredUntil.toISOString(),
      updated_at: now,
    };

    return HttpResponse.json(listingsData[index]);
  }),
];
