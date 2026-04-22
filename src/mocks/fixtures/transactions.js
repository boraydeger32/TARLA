/**
 * Transactions fixture data — payment records for package purchases.
 * Turkish real estate platform transactions with TRY amounts.
 * Matches TransactionResponseSchema.
 *
 * @module mocks/fixtures/transactions
 */

/** @type {import('@/models/Transaction.js').TransactionResponse[]} */
export const transactions = [
  {
    id: 'txn_01ABCD1234567890EFGH',
    user_id: 'usr_02ABCD1234567890EFGH',
    package_id: 'pkg_02IJKL2345678901MNOP',
    listing_id: 'lst_01HQXK9A1B2C3D4E5F6G7H8J',
    amount: 899,
    currency: 'TRY',
    payment_method: 'credit_card',
    status: 'completed',
    reference_code: 'TXN-2026-001234',
    user: { id: 'usr_02ABCD1234567890EFGH', first_name: 'Mehmet', last_name: 'Kaya' },
    package: { id: 'pkg_02IJKL2345678901MNOP', name_tr: 'Profesyonel Paket' },
    refund_reason: null,
    completed_at: '2026-04-15T12:05:00.000Z',
    created_at: '2026-04-15T12:00:00.000Z',
    updated_at: '2026-04-15T12:05:00.000Z',
  },
  {
    id: 'txn_02IJKL2345678901MNOP',
    user_id: 'usr_05XYZA5678901234BCDE',
    package_id: 'pkg_01ABCD1234567890EFGH',
    listing_id: 'lst_04PQRS4567890123TUVW',
    amount: 299,
    currency: 'TRY',
    payment_method: 'credit_card',
    status: 'completed',
    reference_code: 'TXN-2026-001235',
    user: { id: 'usr_05XYZA5678901234BCDE', first_name: 'Ali', last_name: 'Özkan' },
    package: { id: 'pkg_01ABCD1234567890EFGH', name_tr: 'Başlangıç Paketi' },
    refund_reason: null,
    completed_at: '2026-04-16T09:30:00.000Z',
    created_at: '2026-04-16T09:28:00.000Z',
    updated_at: '2026-04-16T09:30:00.000Z',
  },
  {
    id: 'txn_03QRST3456789012UVWX',
    user_id: 'usr_08TUVW1234567890XYZA',
    package_id: 'pkg_03QRST3456789012UVWX',
    listing_id: 'lst_07LMNO0123456789PQRS',
    amount: 2_499,
    currency: 'TRY',
    payment_method: 'bank_transfer',
    status: 'completed',
    reference_code: 'TXN-2026-001236',
    user: { id: 'usr_08TUVW1234567890XYZA', first_name: 'Emre', last_name: 'Koç' },
    package: { id: 'pkg_03QRST3456789012UVWX', name_tr: 'Premium Paket' },
    refund_reason: null,
    completed_at: '2026-04-10T14:20:00.000Z',
    created_at: '2026-04-10T14:15:00.000Z',
    updated_at: '2026-04-10T14:20:00.000Z',
  },
  {
    id: 'txn_04YZAB4567890123CDEF',
    user_id: 'usr_03RSTU9012345678VWXY',
    package_id: 'pkg_01ABCD1234567890EFGH',
    listing_id: 'lst_02JKLM5678901234NOPQ',
    amount: 299,
    currency: 'TRY',
    payment_method: 'credit_card',
    status: 'pending',
    reference_code: 'TXN-2026-001237',
    user: { id: 'usr_03RSTU9012345678VWXY', first_name: 'Ayşe', last_name: 'Demir' },
    package: { id: 'pkg_01ABCD1234567890EFGH', name_tr: 'Başlangıç Paketi' },
    refund_reason: null,
    completed_at: null,
    created_at: '2026-04-20T07:45:00.000Z',
    updated_at: '2026-04-20T07:45:00.000Z',
  },
  {
    id: 'txn_05GHIJ5678901234KLMN',
    user_id: 'usr_06NOPQ7890123456RSTU',
    package_id: 'pkg_02IJKL2345678901MNOP',
    listing_id: 'lst_11PQRS7890123456TUVW',
    amount: 899,
    currency: 'TRY',
    payment_method: 'credit_card',
    status: 'refunded',
    reference_code: 'TXN-2026-001238',
    user: { id: 'usr_06NOPQ7890123456RSTU', first_name: 'Hasan', last_name: 'Çelik' },
    package: { id: 'pkg_02IJKL2345678901MNOP', name_tr: 'Profesyonel Paket' },
    refund_reason: 'Kullanıcı talebi üzerine 14 gün içinde iade yapıldı.',
    completed_at: '2026-04-05T10:00:00.000Z',
    created_at: '2026-04-01T08:00:00.000Z',
    updated_at: '2026-04-07T16:30:00.000Z',
  },
  {
    id: 'txn_06OPQR6789012345STUV',
    user_id: 'usr_04HIJK3456789012LMNO',
    package_id: 'pkg_01ABCD1234567890EFGH',
    listing_id: 'lst_03ZABC2345678901DEFG',
    amount: 299,
    currency: 'TRY',
    payment_method: 'credit_card',
    status: 'failed',
    reference_code: 'TXN-2026-001239',
    user: { id: 'usr_04HIJK3456789012LMNO', first_name: 'Fatma', last_name: 'Yıldırım' },
    package: { id: 'pkg_01ABCD1234567890EFGH', name_tr: 'Başlangıç Paketi' },
    refund_reason: null,
    completed_at: null,
    created_at: '2026-04-19T18:00:00.000Z',
    updated_at: '2026-04-19T18:02:00.000Z',
  },
  {
    id: 'txn_07WXYZ7890123456ABCD',
    user_id: 'usr_07DEFG9012345678HIJK',
    package_id: 'pkg_05GHIJ5678901234KLMN',
    listing_id: null,
    amount: 9_999,
    currency: 'TRY',
    payment_method: 'bank_transfer',
    status: 'completed',
    reference_code: 'TXN-2026-001240',
    user: { id: 'usr_07DEFG9012345678HIJK', first_name: 'Zeynep', last_name: 'Arslan' },
    package: { id: 'pkg_05GHIJ5678901234KLMN', name_tr: 'Kurumsal Paket' },
    refund_reason: null,
    completed_at: '2026-03-20T11:00:00.000Z',
    created_at: '2026-03-20T10:45:00.000Z',
    updated_at: '2026-03-20T11:00:00.000Z',
  },
  {
    id: 'txn_08EFGH8901234567IJKL',
    user_id: 'usr_10ZABC5678901234DEFG',
    package_id: 'pkg_04YZAB4567890123CDEF',
    listing_id: 'lst_09RSTU4567890123VWXY',
    amount: 0,
    currency: 'TRY',
    payment_method: 'free',
    status: 'completed',
    reference_code: 'TXN-2026-001241',
    user: { id: 'usr_10ZABC5678901234DEFG', first_name: 'Elif', last_name: 'Güneş' },
    package: { id: 'pkg_04YZAB4567890123CDEF', name_tr: 'Deneme Paketi' },
    refund_reason: null,
    completed_at: '2026-04-19T20:05:00.000Z',
    created_at: '2026-04-19T20:00:00.000Z',
    updated_at: '2026-04-19T20:05:00.000Z',
  },
];

/**
 * Counter for generating unique IDs for newly created transactions.
 * @type {{ value: number }}
 */
export const transactionIdCounter = { value: 100 };

/**
 * Generates a unique transaction ID.
 * @returns {string}
 */
export function generateTransactionId() {
  transactionIdCounter.value += 1;
  return `txn_new_${String(transactionIdCounter.value).padStart(6, '0')}`;
}

/**
 * Generates a unique transaction reference code.
 * @returns {string}
 */
export function generateReferenceCode() {
  transactionIdCounter.value += 1;
  return `TXN-2026-${String(transactionIdCounter.value + 1300).padStart(6, '0')}`;
}
