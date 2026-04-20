/**
 * Settings fixture data — system-wide key-value configuration.
 * Grouped by category with bilingual labels.
 * Matches SettingResponseSchema.
 *
 * @module mocks/fixtures/settings
 */

/** @type {import('@/models/Setting.js').SettingResponse[]} */
export const settings = [
  // ── Genel (General) ────────────────────────────────────────
  {
    id: 'set_01ABCD1234567890EFGH',
    key: 'site_name',
    value: 'Aperant',
    group: 'genel',
    label_tr: 'Site Adı',
    label_en: 'Site Name',
    description_tr: 'Platformun görünen adı',
    description_en: 'Display name of the platform',
    value_type: 'string',
    is_public: true,
    updated_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'set_02IJKL2345678901MNOP',
    key: 'site_description',
    value: 'Türkiye\'nin güvenilir arsa ve arazi platformu',
    group: 'genel',
    label_tr: 'Site Açıklaması',
    label_en: 'Site Description',
    description_tr: 'SEO ve paylaşımlarda kullanılan açıklama',
    description_en: 'Description used in SEO and social sharing',
    value_type: 'string',
    is_public: true,
    updated_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'set_03QRST3456789012UVWX',
    key: 'maintenance_mode',
    value: 'false',
    group: 'genel',
    label_tr: 'Bakım Modu',
    label_en: 'Maintenance Mode',
    description_tr: 'Aktif edildiğinde site bakım sayfası gösterir',
    description_en: 'When active, site displays maintenance page',
    value_type: 'boolean',
    is_public: false,
    updated_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },

  // ── İlan (Listings) ────────────────────────────────────────
  {
    id: 'set_04YZAB4567890123CDEF',
    key: 'listing_auto_approve',
    value: 'false',
    group: 'ilan',
    label_tr: 'Otomatik Onay',
    label_en: 'Auto Approve',
    description_tr: 'Yeni ilanlar otomatik olarak onaylansın mı?',
    description_en: 'Should new listings be automatically approved?',
    value_type: 'boolean',
    is_public: false,
    updated_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'set_05GHIJ5678901234KLMN',
    key: 'listing_max_images',
    value: '10',
    group: 'ilan',
    label_tr: 'Maksimum Fotoğraf Sayısı',
    label_en: 'Maximum Image Count',
    description_tr: 'Bir ilana yüklenebilecek maksimum fotoğraf sayısı',
    description_en: 'Maximum number of images that can be uploaded per listing',
    value_type: 'number',
    is_public: true,
    updated_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'set_06OPQR6789012345STUV',
    key: 'listing_expiry_days',
    value: '90',
    group: 'ilan',
    label_tr: 'İlan Geçerlilik Süresi (gün)',
    label_en: 'Listing Validity Period (days)',
    description_tr: 'İlanların otomatik olarak süresi dolmadan önceki gün sayısı',
    description_en: 'Number of days before listings automatically expire',
    value_type: 'number',
    is_public: true,
    updated_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-03-15T00:00:00.000Z',
  },

  // ── Ödeme (Payment) ────────────────────────────────────────
  {
    id: 'set_07WXYZ7890123456ABCD',
    key: 'payment_gateway',
    value: 'iyzico',
    group: 'odeme',
    label_tr: 'Ödeme Sağlayıcısı',
    label_en: 'Payment Gateway',
    description_tr: 'Aktif ödeme sağlayıcısı (iyzico, paytr, stripe)',
    description_en: 'Active payment gateway (iyzico, paytr, stripe)',
    value_type: 'string',
    is_public: false,
    updated_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'set_08EFGH8901234567IJKL',
    key: 'refund_period_days',
    value: '14',
    group: 'odeme',
    label_tr: 'İade Süresi (gün)',
    label_en: 'Refund Period (days)',
    description_tr: 'Satın alma tarihinden itibaren iade talep edilebilecek gün sayısı',
    description_en: 'Number of days from purchase date within which refund can be requested',
    value_type: 'number',
    is_public: true,
    updated_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },

  // ── E-posta (Email) ────────────────────────────────────────
  {
    id: 'set_09MNOP9012345678QRST',
    key: 'email_from_address',
    value: 'noreply@aperant.com',
    group: 'eposta',
    label_tr: 'Gönderen E-posta Adresi',
    label_en: 'From Email Address',
    description_tr: 'Sistem e-postalarının gönderildiği adres',
    description_en: 'Address from which system emails are sent',
    value_type: 'string',
    is_public: false,
    updated_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'set_10UVWX0123456789YZAB',
    key: 'email_notifications_enabled',
    value: 'true',
    group: 'eposta',
    label_tr: 'E-posta Bildirimleri',
    label_en: 'Email Notifications',
    description_tr: 'Sistem e-posta bildirimlerini etkinleştir/devre dışı bırak',
    description_en: 'Enable/disable system email notifications',
    value_type: 'boolean',
    is_public: false,
    updated_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },

  // ── SEO ────────────────────────────────────────────────────
  {
    id: 'set_11CDEF1234567890GHIJ',
    key: 'seo_meta_config',
    value: '{"title_suffix":"| Aperant","og_image":"/images/og-default.jpg","twitter_handle":"@aperant"}',
    group: 'seo',
    label_tr: 'SEO Yapılandırması',
    label_en: 'SEO Configuration',
    description_tr: 'Varsayılan SEO meta etiketleri yapılandırması (JSON)',
    description_en: 'Default SEO meta tags configuration (JSON)',
    value_type: 'json',
    is_public: true,
    updated_by: 'usr_12OPQR8901234567STUV',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-10T00:00:00.000Z',
  },
  {
    id: 'set_12KLMN2345678901OPQR',
    key: 'google_analytics_id',
    value: 'G-XXXXXXXXXXXX',
    group: 'seo',
    label_tr: 'Google Analytics ID',
    label_en: 'Google Analytics ID',
    description_tr: 'Google Analytics izleme kodu',
    description_en: 'Google Analytics tracking code',
    value_type: 'string',
    is_public: false,
    updated_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
];

/**
 * Counter for generating unique IDs for newly created settings.
 * @type {{ value: number }}
 */
export const settingIdCounter = { value: 100 };

/**
 * Generates a unique setting ID.
 * @returns {string}
 */
export function generateSettingId() {
  settingIdCounter.value += 1;
  return `set_new_${String(settingIdCounter.value).padStart(6, '0')}`;
}
