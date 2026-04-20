/**
 * Auth fixture data — mock admin user and token factory.
 * Provides realistic Turkish admin user profile matching UserResponseSchema,
 * and helper functions for generating JWT-shaped tokens.
 *
 * @module mocks/fixtures/auth
 */

/**
 * Mock admin user matching UserResponseSchema.
 * Credentials: admin@aperant.test / admin123
 *
 * @type {import('@/models/User.js').UserResponse}
 */
export const adminUser = Object.freeze({
  id: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
  email: 'admin@aperant.test',
  first_name: 'Ahmet',
  last_name: 'Yılmaz',
  phone: '+90 532 123 45 67',
  role: 'super_admin',
  is_active: true,
  avatar_url: null,
  is_verified: true,
  is_banned: false,
  ban_reason: null,
  ban_expires_at: null,
  listings_count: 0,
  last_login_at: '2026-04-19T14:30:00.000Z',
  created_at: '2025-01-15T09:00:00.000Z',
  updated_at: '2026-04-19T14:30:00.000Z',
});

/**
 * Valid credentials for mock login.
 * Only this email/password combination will succeed.
 */
export const validCredentials = Object.freeze({
  email: 'admin@aperant.test',
  password: 'admin123',
});

/**
 * Generates a JWT-shaped access token (not cryptographically valid).
 * Format: base64-header.base64-payload.base64-signature
 *
 * @returns {string} JWT-shaped access token string
 */
export function generateAccessToken() {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    }),
  );
  const signature = btoa(`mock-signature-${Date.now()}`);
  return `${header}.${payload}.${signature}`;
}

/**
 * Generates a JWT-shaped refresh token (not cryptographically valid).
 *
 * @returns {string} JWT-shaped refresh token string
 */
export function generateRefreshToken() {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: adminUser.id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 604800, // 7 days
    }),
  );
  const signature = btoa(`mock-refresh-${Date.now()}`);
  return `${header}.${payload}.${signature}`;
}

/**
 * Tracks the currently active refresh token for validation in handlers.
 * Updated on login and refresh; cleared on logout.
 *
 * @type {{ current: string | null }}
 */
export const activeRefreshToken = { current: null };
