/**
 * Packages fixture data — listing promotion/feature packages.
 * Turkish real estate platform subscription tiers with TRY pricing.
 * Matches PackageResponseSchema.
 *
 * @module mocks/fixtures/packages
 */

/** @type {import('@/models/Package.js').PackageResponse[]} */
export const packages = [
  {
    id: 'pkg_01ABCD1234567890EFGH',
    name_tr: 'Başlangıç Paketi',
    name_en: 'Starter Package',
    description_tr: 'Tek ilan için temel öne çıkarma paketi. 7 gün boyunca ilanınız arama sonuçlarında üst sıralarda görünür.',
    description_en: 'Basic feature package for a single listing. Your listing appears at the top of search results for 7 days.',
    price: 299,
    currency: 'TRY',
    duration_days: 7,
    features: [
      'Arama sonuçlarında üst sıra',
      'Öne çıkan rozeti',
      '7 gün süre',
    ],
    is_active: true,
    sort_order: 1,
    subscribers_count: 45,
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'pkg_02IJKL2345678901MNOP',
    name_tr: 'Profesyonel Paket',
    name_en: 'Professional Package',
    description_tr: 'Birden fazla ilan için gelişmiş öne çıkarma. 30 gün süre, ana sayfa vitrin alanı ve detaylı istatistikler.',
    description_en: 'Advanced feature package for multiple listings. 30-day duration, homepage showcase, and detailed analytics.',
    price: 899,
    currency: 'TRY',
    duration_days: 30,
    features: [
      'Arama sonuçlarında üst sıra',
      'Ana sayfa vitrin alanı',
      'Detaylı görüntülenme istatistikleri',
      'Öne çıkan rozeti',
      '30 gün süre',
    ],
    is_active: true,
    sort_order: 2,
    subscribers_count: 23,
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'pkg_03QRST3456789012UVWX',
    name_tr: 'Premium Paket',
    name_en: 'Premium Package',
    description_tr: 'En kapsamlı öne çıkarma paketi. 90 gün süre, tüm vitranlarda öncelik, sosyal medya paylaşımı ve VIP destek.',
    description_en: 'Most comprehensive feature package. 90-day duration, priority in all showcases, social media promotion, and VIP support.',
    price: 2_499,
    currency: 'TRY',
    duration_days: 90,
    features: [
      'Tüm vitrinlerde öncelik',
      'Sosyal medya paylaşımı',
      'VIP müşteri desteği',
      'Detaylı görüntülenme istatistikleri',
      'Ana sayfa vitrin alanı',
      'Öne çıkan rozeti',
      '90 gün süre',
    ],
    is_active: true,
    sort_order: 3,
    subscribers_count: 8,
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'pkg_04YZAB4567890123CDEF',
    name_tr: 'Deneme Paketi',
    name_en: 'Trial Package',
    description_tr: 'Yeni kullanıcılar için ücretsiz deneme paketi. 3 gün boyunca temel öne çıkarma.',
    description_en: 'Free trial package for new users. Basic featuring for 3 days.',
    price: 0,
    currency: 'TRY',
    duration_days: 3,
    features: [
      'Arama sonuçlarında üst sıra',
      'Öne çıkan rozeti',
      '3 gün süre',
    ],
    is_active: false,
    sort_order: 0,
    subscribers_count: 120,
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'pkg_05GHIJ5678901234KLMN',
    name_tr: 'Kurumsal Paket',
    name_en: 'Enterprise Package',
    description_tr: 'Emlak firmaları için toplu ilan paketi. 180 gün süre, 50 ilan kapasiteli, özel hesap yöneticisi.',
    description_en: 'Bulk listing package for real estate agencies. 180-day duration, 50 listing capacity, dedicated account manager.',
    price: 9_999,
    currency: 'TRY',
    duration_days: 180,
    features: [
      '50 ilan kapasitesi',
      'Özel hesap yöneticisi',
      'Tüm vitrinlerde öncelik',
      'API erişimi',
      'Detaylı raporlama',
      'Sosyal medya paylaşımı',
      'VIP müşteri desteği',
      '180 gün süre',
    ],
    is_active: true,
    sort_order: 4,
    subscribers_count: 3,
    created_at: '2025-09-01T00:00:00.000Z',
    updated_at: '2026-04-10T00:00:00.000Z',
  },
];

/**
 * Counter for generating unique IDs for newly created packages.
 * @type {{ value: number }}
 */
export const packageIdCounter = { value: 100 };

/**
 * Generates a unique package ID.
 * @returns {string}
 */
export function generatePackageId() {
  packageIdCounter.value += 1;
  return `pkg_new_${String(packageIdCounter.value).padStart(6, '0')}`;
}
