/**
 * Dashboard fixture data for MSW handlers.
 * Turkish-realistic stats, charts, and activity feed.
 *
 * @module mocks/fixtures/dashboard
 */

export const dashboardStats = Object.freeze({
  active_listings: { value: 12847, change: 8.4 },
  pending_count: { value: 142, change: -12.3 },
  total_users: { value: 48_921, change: 5.7 },
  revenue: { value: 2_485_600, change: 18.2, currency: 'TRY' },
});

const months = ['Kas', 'Ara', 'Oca', 'Şub', 'Mar', 'Nis'];

export const dashboardCharts = Object.freeze({
  listings_over_time: {
    labels: months,
    series: [
      { name: 'Yeni İlanlar', data: [820, 932, 901, 1234, 1090, 1340] },
      { name: 'Onaylanan', data: [760, 850, 865, 1120, 980, 1220] },
    ],
  },
  revenue_by_month: {
    labels: months,
    series: [
      { name: 'Gelir (₺)', data: [180_000, 210_000, 245_000, 280_000, 310_000, 350_000] },
    ],
  },
  listings_by_category: {
    labels: ['Arsa', 'Tarla', 'Bahçe', 'Bağ', 'Zeytinlik', 'Diğer'],
    series: [4820, 3210, 1540, 980, 620, 1677],
  },
  user_growth: {
    labels: months,
    series: [
      { name: 'Yeni Kayıt', data: [1240, 1520, 1380, 1670, 1840, 2100] },
      { name: 'Aktif Kullanıcı', data: [18_200, 19_800, 21_300, 23_100, 25_400, 27_800] },
    ],
  },
});

function minutesAgo(n) {
  return new Date(Date.now() - n * 60_000).toISOString();
}

export const recentActivities = [
  {
    id: 'act_1',
    action: 'listing.approve',
    description: 'Beykoz Riva\'da 2.500 m² satılık arsa ilanı onaylandı.',
    user: { first_name: 'Ahmet', last_name: 'Yılmaz' },
    created_at: minutesAgo(3),
  },
  {
    id: 'act_2',
    action: 'user.ban',
    description: '"hasankaya91" kullanıcısı dolandırıcılık nedeniyle süresiz banlandı.',
    user: { first_name: 'Zeynep', last_name: 'Demir' },
    created_at: minutesAgo(18),
  },
  {
    id: 'act_3',
    action: 'listing.reject',
    description: 'Çanakkale Ayvacık\'taki zeytinlik ilanı eksik tapu bilgisi nedeniyle reddedildi.',
    user: { first_name: 'Mehmet', last_name: 'Kaya' },
    created_at: minutesAgo(42),
  },
  {
    id: 'act_4',
    action: 'listing.create',
    description: 'İzmir Urla\'da 8.400 m² tarla ilanı oluşturuldu.',
    user: { first_name: 'Selin', last_name: 'Arslan' },
    created_at: minutesAgo(67),
  },
  {
    id: 'act_5',
    action: 'transaction.refund',
    description: 'Premium paket için 1.450 ₺ iade işlendi.',
    user: { first_name: 'Emre', last_name: 'Aydın' },
    created_at: minutesAgo(95),
  },
  {
    id: 'act_6',
    action: 'category.create',
    description: 'Yeni kategori eklendi: "Organik Tarım Arazisi".',
    user: { first_name: 'Burak', last_name: 'Şahin' },
    created_at: minutesAgo(140),
  },
  {
    id: 'act_7',
    action: 'setting.update',
    description: 'İlan yayın süresi varsayılanı 30 günden 45 güne çıkarıldı.',
    user: { first_name: 'Ahmet', last_name: 'Yılmaz' },
    created_at: minutesAgo(210),
  },
  {
    id: 'act_8',
    action: 'report.action',
    description: 'Sahte ilan şikayeti üzerine ilan yayından kaldırıldı.',
    user: { first_name: 'Zeynep', last_name: 'Demir' },
    created_at: minutesAgo(340),
  },
];
