/**
 * MSW handlers for user management endpoints.
 * Simulates GET/POST/PATCH/DELETE /users with pagination, filtering,
 * and special actions (ban, role change, verify).
 * All handlers include 200-600ms simulated latency.
 *
 * Response shapes match FastAPI PaginatedResponse<T> exactly.
 * Error responses follow FastAPI format: { "detail": "..." }
 *
 * @module mocks/handlers/users
 */

import { http, HttpResponse, delay } from 'msw';

import { users, generateUserId } from '../fixtures/users.js';

/**
 * Simulates realistic network latency (200-600ms).
 * @returns {Promise<void>}
 */
function simulateLatency() {
  return delay(Math.random() * 400 + 200);
}

/**
 * Mutable copy of users for CRUD operations within the MSW session.
 * Reset on page reload (MSW re-initializes).
 * @type {import('@/models/User.js').UserResponse[]}
 */
let usersData = [...users];

/**
 * Filters users based on query parameters.
 * @param {import('@/models/User.js').UserResponse[]} data
 * @param {URLSearchParams} params
 * @returns {import('@/models/User.js').UserResponse[]}
 */
function filterUsers(data, params) {
  let filtered = [...data];

  const role = params.get('role');
  if (role && role !== 'all') {
    filtered = filtered.filter((u) => u.role === role);
  }

  const search = params.get('search');
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.first_name.toLowerCase().includes(term) ||
        u.last_name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term),
    );
  }

  const isActive = params.get('is_active');
  if (isActive !== null && isActive !== undefined && isActive !== '') {
    const active = isActive === 'true';
    filtered = filtered.filter((u) => u.is_active === active);
  }

  const isBanned = params.get('is_banned');
  if (isBanned !== null && isBanned !== undefined && isBanned !== '') {
    const banned = isBanned === 'true';
    filtered = filtered.filter((u) => u.is_banned === banned);
  }

  const isVerified = params.get('is_verified');
  if (isVerified !== null && isVerified !== undefined && isVerified !== '') {
    const verified = isVerified === 'true';
    filtered = filtered.filter((u) => u.is_verified === verified);
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
 * Users MSW request handlers.
 * @type {import('msw').HttpHandler[]}
 */
export const usersHandlers = [
  /**
   * GET /users — paginated list with filtering.
   * Query params: page, size, role, search, is_active, is_banned,
   *   is_verified, sort_by, sort_order
   */
  http.get('*/api/v1/users', async ({ request }) => {
    await simulateLatency();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);

    const filtered = filterUsers(usersData, url.searchParams);
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
   * GET /users/:id — single user detail.
   */
  http.get('*/api/v1/users/:id', async ({ params }) => {
    await simulateLatency();

    const user = usersData.find((u) => u.id === params.id);

    if (!user) {
      return HttpResponse.json(
        { detail: 'User not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(user);
  }),

  /**
   * POST /users — create a new user (admin action).
   */
  http.post('*/api/v1/users', async ({ request }) => {
    await simulateLatency();

    const body = await request.json();

    if (!body.email || !body.first_name || !body.last_name || !body.password) {
      return HttpResponse.json(
        { detail: 'Missing required fields: email, first_name, last_name, password' },
        { status: 422 },
      );
    }

    const existing = usersData.find((u) => u.email === body.email);
    if (existing) {
      return HttpResponse.json(
        { detail: 'A user with this email already exists' },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const newUser = {
      id: generateUserId(),
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone ?? null,
      role: body.role ?? 'user',
      is_active: body.is_active ?? true,
      avatar_url: null,
      is_verified: false,
      is_banned: false,
      ban_reason: null,
      ban_expires_at: null,
      listings_count: 0,
      last_login_at: null,
      created_at: now,
      updated_at: now,
    };

    usersData.unshift(newUser);

    return HttpResponse.json(newUser, { status: 201 });
  }),

  /**
   * PATCH /users/:id — update a user.
   */
  http.patch('*/api/v1/users/:id', async ({ params, request }) => {
    await simulateLatency();

    const index = usersData.findIndex((u) => u.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'User not found' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const updated = {
      ...usersData[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    usersData[index] = updated;

    return HttpResponse.json(updated);
  }),

  /**
   * DELETE /users/:id — delete a user.
   */
  http.delete('*/api/v1/users/:id', async ({ params }) => {
    await simulateLatency();

    const index = usersData.findIndex((u) => u.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'User not found' },
        { status: 404 },
      );
    }

    usersData.splice(index, 1);

    return HttpResponse.json({ detail: 'User deleted successfully' });
  }),

  /**
   * POST /users/:id/ban — ban a user with reason and optional duration.
   */
  http.post('*/api/v1/users/:id/ban', async ({ params, request }) => {
    await simulateLatency();

    const index = usersData.findIndex((u) => u.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'User not found' },
        { status: 404 },
      );
    }

    if (usersData[index].is_banned) {
      return HttpResponse.json(
        { detail: 'User is already banned' },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (!body.reason) {
      return HttpResponse.json(
        { detail: 'Ban reason is required' },
        { status: 422 },
      );
    }

    let banExpiresAt = null;
    if (body.duration_days) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + body.duration_days);
      banExpiresAt = expiresAt.toISOString();
    }

    const now = new Date().toISOString();
    usersData[index] = {
      ...usersData[index],
      is_banned: true,
      is_active: false,
      ban_reason: body.reason,
      ban_expires_at: banExpiresAt,
      updated_at: now,
    };

    return HttpResponse.json(usersData[index]);
  }),

  /**
   * PATCH /users/:id/role — change a user's role.
   */
  http.patch('*/api/v1/users/:id/role', async ({ params, request }) => {
    await simulateLatency();

    const index = usersData.findIndex((u) => u.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'User not found' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const validRoles = ['super_admin', 'moderator', 'content_manager', 'user'];

    if (!body.role || !validRoles.includes(body.role)) {
      return HttpResponse.json(
        { detail: 'Invalid role. Must be one of: super_admin, moderator, content_manager, user' },
        { status: 422 },
      );
    }

    const now = new Date().toISOString();
    usersData[index] = {
      ...usersData[index],
      role: body.role,
      updated_at: now,
    };

    return HttpResponse.json(usersData[index]);
  }),

  /**
   * POST /users/:id/verify — verify a user's account.
   */
  http.post('*/api/v1/users/:id/verify', async ({ params }) => {
    await simulateLatency();

    const index = usersData.findIndex((u) => u.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'User not found' },
        { status: 404 },
      );
    }

    if (usersData[index].is_verified) {
      return HttpResponse.json(
        { detail: 'User is already verified' },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    usersData[index] = {
      ...usersData[index],
      is_verified: true,
      updated_at: now,
    };

    return HttpResponse.json(usersData[index]);
  }),
];
