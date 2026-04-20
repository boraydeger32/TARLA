/**
 * Categories fixture data — Turkish real estate listing categories.
 * Matches CategoryResponseSchema with bilingual names and slugs.
 *
 * @module mocks/fixtures/categories
 */

/** @type {import('@/models/Category.js').CategoryResponse[]} */
export const categories = [
  {
    id: 'cat_arsa',
    name_tr: 'Arsa',
    name_en: 'Land Plot',
    slug: 'arsa',
    description_tr: 'Konut, ticari veya karma imarlı satılık arsalar',
    description_en: 'Residential, commercial, or mixed-use land plots for sale',
    icon: 'map',
    sort_order: 1,
    is_active: true,
    listings_count: 5,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'cat_ticari',
    name_tr: 'Ticari Arsa',
    name_en: 'Commercial Land',
    slug: 'ticari-arsa',
    description_tr: 'Ticari imarlı arsalar ve iş yeri arazileri',
    description_en: 'Commercially zoned land and business plots',
    icon: 'building-office',
    sort_order: 2,
    is_active: true,
    listings_count: 2,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'cat_tarla',
    name_tr: 'Tarla',
    name_en: 'Agricultural Field',
    slug: 'tarla',
    description_tr: 'Tarım arazileri, bağ ve bahçe alanları',
    description_en: 'Agricultural fields, vineyards, and orchards',
    icon: 'sun',
    sort_order: 3,
    is_active: true,
    listings_count: 4,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'cat_sanayi',
    name_tr: 'Sanayi Arsası',
    name_en: 'Industrial Land',
    slug: 'sanayi-arsasi',
    description_tr: 'Sanayi imarlı arsalar ve fabrika arazileri',
    description_en: 'Industrial zoned land and factory plots',
    icon: 'cog',
    sort_order: 4,
    is_active: true,
    listings_count: 1,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'cat_karma',
    name_tr: 'Karma İmarlı',
    name_en: 'Mixed Use',
    slug: 'karma-imarli',
    description_tr: 'Konut ve ticari karma kullanım imarlı araziler',
    description_en: 'Mixed residential and commercial use land',
    icon: 'squares-2x2',
    sort_order: 5,
    is_active: true,
    listings_count: 1,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'cat_zeytinlik',
    name_tr: 'Zeytinlik',
    name_en: 'Olive Grove',
    slug: 'zeytinlik',
    description_tr: 'Zeytin ağaçları bulunan tarım arazileri',
    description_en: 'Agricultural land with olive trees',
    icon: 'leaf',
    sort_order: 6,
    is_active: false,
    listings_count: 0,
    created_at: '2025-03-15T10:00:00.000Z',
    updated_at: '2026-02-20T14:00:00.000Z',
  },
];

/**
 * Counter for generating unique IDs for newly created categories.
 * @type {{ value: number }}
 */
export const categoryIdCounter = { value: 100 };

/**
 * Generates a unique category ID.
 * @returns {string}
 */
export function generateCategoryId() {
  categoryIdCounter.value += 1;
  return `cat_new_${String(categoryIdCounter.value).padStart(6, '0')}`;
}
