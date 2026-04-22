/**
 * MSW handlers for transactions endpoints.
 * Simulates GET/POST /transactions with pagination, filtering,
 * and status transitions (complete, refund).
 * All handlers include 200-600ms simulated latency.
 *
 * Response shapes match FastAPI PaginatedResponse<T> exactly.
 * Error responses follow FastAPI format: { "detail": "..." }
 *
 * @module mocks/handlers/transactions
 */

import { http, HttpResponse, delay } from 'msw';

import { transactions, generateTransactionId, generateReferenceCode } from '../fixtures/transactions.js';

/**
 * Simulates realistic network latency (200-600ms).
 * @returns {Promise<void>}
 */
function simulateLatency() {
  return delay(Math.random() * 400 + 200);
}

/**
 * Mutable copy of transactions for CRUD operations within the MSW session.
 * @type {import('@/models/Transaction.js').TransactionResponse[]}
 */
let transactionsData = [...transactions];

/**
 * Filters transactions based on query parameters.
 * @param {import('@/models/Transaction.js').TransactionResponse[]} data
 * @param {URLSearchParams} params
 * @returns {import('@/models/Transaction.js').TransactionResponse[]}
 */
function filterTransactions(data, params) {
  let filtered = [...data];

  const status = params.get('status');
  if (status && status !== 'all') {
    filtered = filtered.filter((t) => t.status === status);
  }

  const userId = params.get('user_id');
  if (userId) {
    filtered = filtered.filter((t) => t.user_id === userId);
  }

  const packageId = params.get('package_id');
  if (packageId) {
    filtered = filtered.filter((t) => t.package_id === packageId);
  }

  const paymentMethod = params.get('payment_method');
  if (paymentMethod) {
    filtered = filtered.filter((t) => t.payment_method === paymentMethod);
  }

  const search = params.get('search');
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.reference_code.toLowerCase().includes(term) ||
        (t.user && `${t.user.first_name} ${t.user.last_name}`.toLowerCase().includes(term)),
    );
  }

  const dateFrom = params.get('date_from');
  if (dateFrom) {
    filtered = filtered.filter((t) => t.created_at >= dateFrom);
  }

  const dateTo = params.get('date_to');
  if (dateTo) {
    filtered = filtered.filter((t) => t.created_at <= dateTo);
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
 * Transactions MSW request handlers.
 * @type {import('msw').HttpHandler[]}
 */
export const transactionsHandlers = [
  /**
   * GET /transactions — paginated list with filtering.
   * Query params: page, size, status, user_id, package_id, payment_method,
   *   search, date_from, date_to, sort_by, sort_order
   */
  http.get('*/api/v1/transactions', async ({ request }) => {
    await simulateLatency();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);

    const filtered = filterTransactions(transactionsData, url.searchParams);
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
   * GET /transactions/:id — single transaction detail.
   */
  http.get('*/api/v1/transactions/:id', async ({ params }) => {
    await simulateLatency();

    const transaction = transactionsData.find((t) => t.id === params.id);

    if (!transaction) {
      return HttpResponse.json(
        { detail: 'Transaction not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(transaction);
  }),

  /**
   * POST /transactions — create a new transaction.
   */
  http.post('*/api/v1/transactions', async ({ request }) => {
    await simulateLatency();

    const body = await request.json();

    if (!body.user_id || !body.package_id || body.amount === undefined || !body.payment_method) {
      return HttpResponse.json(
        { detail: 'Missing required fields: user_id, package_id, amount, payment_method' },
        { status: 422 },
      );
    }

    const now = new Date().toISOString();
    const newTransaction = {
      id: generateTransactionId(),
      user_id: body.user_id,
      package_id: body.package_id,
      listing_id: body.listing_id ?? null,
      amount: body.amount,
      currency: body.currency ?? 'TRY',
      payment_method: body.payment_method,
      status: 'pending',
      reference_code: generateReferenceCode(),
      user: null,
      package: null,
      refund_reason: null,
      completed_at: null,
      created_at: now,
      updated_at: now,
    };

    transactionsData.unshift(newTransaction);

    return HttpResponse.json(newTransaction, { status: 201 });
  }),

  /**
   * POST /transactions/:id/complete — mark a transaction as completed.
   */
  http.post('*/api/v1/transactions/:id/complete', async ({ params }) => {
    await simulateLatency();

    const index = transactionsData.findIndex((t) => t.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Transaction not found' },
        { status: 404 },
      );
    }

    if (transactionsData[index].status !== 'pending') {
      return HttpResponse.json(
        { detail: 'Only pending transactions can be completed' },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    transactionsData[index] = {
      ...transactionsData[index],
      status: 'completed',
      completed_at: now,
      updated_at: now,
    };

    return HttpResponse.json(transactionsData[index]);
  }),

  /**
   * POST /transactions/:id/refund — refund a completed transaction.
   */
  http.post('*/api/v1/transactions/:id/refund', async ({ params, request }) => {
    await simulateLatency();

    const index = transactionsData.findIndex((t) => t.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { detail: 'Transaction not found' },
        { status: 404 },
      );
    }

    if (transactionsData[index].status !== 'completed') {
      return HttpResponse.json(
        { detail: 'Only completed transactions can be refunded' },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (!body.reason) {
      return HttpResponse.json(
        { detail: 'Refund reason is required' },
        { status: 422 },
      );
    }

    const now = new Date().toISOString();
    transactionsData[index] = {
      ...transactionsData[index],
      status: 'refunded',
      refund_reason: body.reason,
      updated_at: now,
    };

    return HttpResponse.json(transactionsData[index]);
  }),
];
