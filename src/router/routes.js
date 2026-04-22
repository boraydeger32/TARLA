/**
 * Simple hash-based route table.
 * Full Navigo routing arrives in Task 6; this stub lets the sidebar feel
 * alive by swapping the route-outlet content and marking active items.
 *
 * Each route exports a `render(outlet)` function so views can register
 * Alpine data factories before setting innerHTML (imperative mount here
 * is acceptable at the boot shell level).
 *
 * @module router/routes
 */

import dashboardTemplate from '@/views/dashboard/dashboard.html?raw';

function placeholder(title, description) {
  return `
    <div class="mx-auto max-w-3xl rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
      <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
        <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </div>
      <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">${title}</h2>
      <p class="text-gray-600 dark:text-gray-400">${description}</p>
      <p class="mt-6 text-sm text-gray-500 dark:text-gray-500">
        Bu modül henüz iskelet aşamasında — ilgili task Aperant roadmap'inde sırada.
      </p>
    </div>`;
}

export const ROUTES = {
  dashboard: {
    title: 'Kontrol Paneli',
    module: 'dashboard',
    html: dashboardTemplate,
  },
  'dashboard/analytics': {
    title: 'Analitik',
    module: 'dashboard',
    html: placeholder('Analitik', 'Detaylı analitik raporları yakında burada görünecek.'),
  },
  listings: {
    title: 'Tüm İlanlar',
    module: 'listings',
    html: placeholder('İlan Yönetimi', 'Grid.js tablosu, filtreler ve sayfalama Task 7 kapsamında gelecek.'),
  },
  'listings/pending': {
    title: 'Bekleyen İlanlar',
    module: 'listings',
    html: placeholder('Bekleyen İlanlar', 'Onay bekleyen 142 ilan listesi burada olacak.'),
  },
  'listings/featured': {
    title: 'Vitrindeki İlanlar',
    module: 'listings',
    html: placeholder('Vitrindekiler', 'Öne çıkarılmış ilanlar burada listelenecek.'),
  },
  'listings/new': {
    title: 'Yeni İlan',
    module: 'listings',
    html: placeholder('Yeni İlan Oluştur', 'Alpine + zod doğrulamalı ilan oluşturma formu.'),
  },
  users: {
    title: 'Kullanıcılar',
    module: 'users',
    html: placeholder('Kullanıcı Yönetimi', 'Kullanıcı tablosu ve ban/rol aksiyonları Task 8 ile gelecek.'),
  },
  'users/banned': {
    title: 'Banlı Kullanıcılar',
    module: 'users',
    html: placeholder('Banlı Kullanıcılar', 'Ban geçmişi ve ban kaldırma işlemleri.'),
  },
  'users/pending': {
    title: 'Doğrulama Bekleyen',
    module: 'users',
    html: placeholder('Doğrulama Bekleyen Kullanıcılar', 'E-posta veya telefon doğrulaması bekleyen kullanıcılar.'),
  },
  categories: {
    title: 'Kategoriler',
    module: 'categories',
    html: placeholder('Kategori Ağacı', 'Ağaç yapısında kategori yönetimi.'),
  },
  locations: {
    title: 'Konumlar',
    module: 'categories',
    html: placeholder('Konum Ağacı', 'İl / İlçe / Mahalle 3 seviyeli konum ağacı.'),
  },
  zoning: {
    title: 'İmar Durumları',
    module: 'categories',
    html: placeholder('İmar Durumları', 'Arsa türleri için imar etiketleri.'),
  },
  moderation: {
    title: 'Şikayet Kuyruğu',
    module: 'moderation',
    html: placeholder('Moderasyon', 'Şikayet kuyruğu + drawer aksiyonları Task 11 ile.'),
  },
  'moderation/history': {
    title: 'Moderasyon Geçmişi',
    module: 'moderation',
    html: placeholder('Moderasyon Geçmişi', 'Tarihsel moderasyon kararları.'),
  },
  packages: {
    title: 'Paketler',
    module: 'packages',
    html: placeholder('Paket Yönetimi', 'Premium/Vitrin paketlerinin CRUD\'u.'),
  },
  transactions: {
    title: 'İşlemler',
    module: 'packages',
    html: placeholder('İşlem Listesi', 'Ödemeler, iadeler ve fatura geçmişi.'),
  },
  'content/banners': {
    title: 'Banner\'lar',
    module: 'content',
    html: placeholder('Banner Yönetimi', 'Ana sayfa banner\'ları ve kampanyalar.'),
  },
  'content/faqs': {
    title: 'SSS',
    module: 'content',
    html: placeholder('SSS Yönetimi', 'Sık sorulan sorular CRUD\'u.'),
  },
  'content/blog': {
    title: 'Blog',
    module: 'content',
    html: placeholder('Blog Yönetimi', 'Blog yazıları CRUD\'u.'),
  },
  reports: {
    title: 'Raporlar',
    module: 'reports',
    html: placeholder('Rapor Oluşturucu', 'Özel tarih aralığı + filtre ile rapor üretici.'),
  },
  'reports/listings': {
    title: 'İlan Raporları',
    module: 'reports',
    html: placeholder('İlan Raporları', 'İlan metriklerine özel raporlar.'),
  },
  'reports/financial': {
    title: 'Finansal Raporlar',
    module: 'reports',
    html: placeholder('Finansal Raporlar', 'Gelir, iade ve komisyon raporları.'),
  },
  settings: {
    title: 'Ayarlar',
    module: 'settings',
    html: placeholder('Genel Ayarlar', 'Platform genelinde uygulanan ayarlar.'),
  },
  'settings/integrations': {
    title: 'Entegrasyonlar',
    module: 'settings',
    html: placeholder('Entegrasyonlar', 'Ödeme, SMS, e-posta sağlayıcı ayarları.'),
  },
  logs: {
    title: 'Sistem Logları',
    module: 'settings',
    html: placeholder('Sistem Logları', 'Audit log ve aktivite log görüntüleyici.'),
  },
};

export function resolveRoute(slug) {
  return ROUTES[slug] ?? ROUTES.dashboard;
}
