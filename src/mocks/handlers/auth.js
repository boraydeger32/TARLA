/**
 * MSW handlers for authentication endpoints.
 * Simulates POST /auth/login, POST /auth/refresh, POST /auth/logout, GET /auth/me.
 * All handlers include 200-600ms simulated latency.
 *
 * Response shapes match FastAPI contract from design.md §9.3.
 * Error responses follow FastAPI format: { "detail": "..." }
 *
 * @module mocks/handlers/auth
 */

import { http, HttpResponse, delay } from 'msw';

import {
  adminUser,
  validCredentials,
  generateAccessToken,
  generateRefreshToken,
  activeRefreshToken,
} from '../fixtures/auth.js';

/**
 * Simulates realistic network latency (200-600ms).
 * @returns {Promise<void>}
 */
function simulateLatency() {
  return delay(Math.random() * 400 + 200);
}

/**
 * Auth MSW request handlers.
 * @type {import('msw').HttpHandler[]}
 */
export const authHandlers = [
  /**
   * POST /auth/login
   * Validates email + password against mock credentials.
   * Returns JWT-shaped tokens + user object on success.
   */
  http.post('*/api/v1/auth/login', async ({ request }) => {
    await simulateLatency();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return HttpResponse.json(
        { detail: 'Email and password are required' },
        { status: 422 },
      );
    }

    if (email !== validCredentials.email || password !== validCredentials.password) {
      return HttpResponse.json(
        { detail: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const accessToken = generateAccessToken();
    const refreshToken = generateRefreshToken();
    activeRefreshToken.current = refreshToken;

    return HttpResponse.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'bearer',
      user: adminUser,
    });
  }),

  /**
   * POST /auth/refresh
   * Validates the provided refresh token and returns new token pair.
   * Simulates token rotation (old refresh token invalidated).
   */
  http.post('*/api/v1/auth/refresh', async ({ request }) => {
    await simulateLatency();

    const body = await request.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return HttpResponse.json(
        { detail: 'Refresh token is required' },
        { status: 422 },
      );
    }

    if (refresh_token !== activeRefreshToken.current) {
      return HttpResponse.json(
        { detail: 'Invalid or expired refresh token' },
        { status: 401 },
      );
    }

    const newAccessToken = generateAccessToken();
    const newRefreshToken = generateRefreshToken();
    activeRefreshToken.current = newRefreshToken;

    return HttpResponse.json({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      token_type: 'bearer',
    });
  }),

  /**
   * POST /auth/logout
   * Invalidates the current session by clearing the active refresh token.
   */
  http.post('*/api/v1/auth/logout', async () => {
    await simulateLatency();

    activeRefreshToken.current = null;

    return HttpResponse.json({
      detail: 'Successfully logged out',
    });
  }),

  /**
   * GET /auth/me
   * Returns the current authenticated user's profile.
   * Validates Bearer token presence in Authorization header.
   */
  http.get('*/api/v1/auth/me', async ({ request }) => {
    await simulateLatency();

    const authorization = request.headers.get('Authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return HttpResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 },
      );
    }

    return HttpResponse.json(adminUser);
  }),
];
