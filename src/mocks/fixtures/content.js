/**
 * Content fixture data — banners, FAQs, and blog posts.
 * Bilingual Turkish/English content for the platform.
 * Matches BannerResponseSchema, FAQResponseSchema, BlogPostResponseSchema.
 *
 * @module mocks/fixtures/content
 */

/** @type {import('@/models/Banner.js').BannerResponse[]} */
export const banners = [
  {
    id: 'bnr_01ABCD1234567890EFGH',
    title_tr: 'Yaz Kampanyası — %20 İndirim',
    title_en: 'Summer Campaign — 20% Off',
    subtitle_tr: 'Tüm öne çıkarma paketlerinde geçerli',
    subtitle_en: 'Valid on all featuring packages',
    image_url: '/images/banners/summer-campaign.jpg',
    link_url: '/packages',
    position: 'homepage_top',
    sort_order: 1,
    is_active: true,
    starts_at: '2026-06-01T00:00:00.000Z',
    ends_at: '2026-08-31T23:59:59.000Z',
    click_count: 1245,
    impression_count: 34567,
    created_by: 'usr_12OPQR8901234567STUV',
    created_at: '2026-04-15T10:00:00.000Z',
    updated_at: '2026-04-18T14:00:00.000Z',
  },
  {
    id: 'bnr_02IJKL2345678901MNOP',
    title_tr: 'Yeni Üyelere Özel Fırsat',
    title_en: 'Special Offer for New Members',
    subtitle_tr: 'İlk ilanınızı ücretsiz öne çıkarın',
    subtitle_en: 'Feature your first listing for free',
    image_url: '/images/banners/new-members.jpg',
    link_url: '/register',
    position: 'homepage_middle',
    sort_order: 2,
    is_active: true,
    starts_at: null,
    ends_at: null,
    click_count: 892,
    impression_count: 21345,
    created_by: 'usr_12OPQR8901234567STUV',
    created_at: '2026-03-01T08:00:00.000Z',
    updated_at: '2026-04-10T09:00:00.000Z',
  },
  {
    id: 'bnr_03QRST3456789012UVWX',
    title_tr: 'Aperant Mobil Uygulaması Çok Yakında',
    title_en: 'Aperant Mobile App Coming Soon',
    subtitle_tr: 'iOS ve Android için yakında yayında',
    subtitle_en: 'Launching soon for iOS and Android',
    image_url: '/images/banners/mobile-app.jpg',
    link_url: null,
    position: 'sidebar',
    sort_order: 1,
    is_active: false,
    starts_at: '2026-07-01T00:00:00.000Z',
    ends_at: null,
    click_count: 0,
    impression_count: 0,
    created_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    created_at: '2026-04-20T07:00:00.000Z',
    updated_at: '2026-04-20T07:00:00.000Z',
  },
];

/** @type {import('@/models/FAQ.js').FAQResponse[]} */
export const faqs = [
  {
    id: 'faq_01ABCD1234567890EFGH',
    question_tr: 'Nasıl ilan verebilirim?',
    question_en: 'How can I create a listing?',
    answer_tr: 'Hesabınıza giriş yaptıktan sonra "İlan Ver" butonuna tıklayarak ilan oluşturma formunu doldurabilirsiniz. İlanınız moderatör onayından geçtikten sonra yayınlanacaktır.',
    answer_en: 'After logging into your account, click the "Create Listing" button to fill out the listing form. Your listing will be published after moderator approval.',
    category: 'genel',
    sort_order: 1,
    is_active: true,
    view_count: 1234,
    created_by: 'usr_12OPQR8901234567STUV',
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'faq_02IJKL2345678901MNOP',
    question_tr: 'İlanım ne kadar sürede onaylanır?',
    question_en: 'How long does listing approval take?',
    answer_tr: 'İlanlar genellikle 24 saat içinde incelenir ve onaylanır. Yoğun dönemlerde bu süre 48 saate kadar uzayabilir.',
    answer_en: 'Listings are typically reviewed and approved within 24 hours. During peak periods, this may extend to 48 hours.',
    category: 'ilan',
    sort_order: 2,
    is_active: true,
    view_count: 987,
    created_by: 'usr_12OPQR8901234567STUV',
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'faq_03QRST3456789012UVWX',
    question_tr: 'Öne çıkarma paketi nasıl çalışır?',
    question_en: 'How does the featuring package work?',
    answer_tr: 'Öne çıkarma paketi satın aldığınızda ilanınız belirlenen süre boyunca arama sonuçlarında üst sıralarda gösterilir ve özel bir rozet ile işaretlenir.',
    answer_en: 'When you purchase a featuring package, your listing is shown at the top of search results for the specified duration and marked with a special badge.',
    category: 'paket',
    sort_order: 3,
    is_active: true,
    view_count: 756,
    created_by: 'usr_12OPQR8901234567STUV',
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'faq_04YZAB4567890123CDEF',
    question_tr: 'İade politikası nedir?',
    question_en: 'What is the refund policy?',
    answer_tr: 'Satın alma tarihinden itibaren 14 gün içinde iade talebinde bulunabilirsiniz. İade işlemi 3-5 iş günü içinde tamamlanır.',
    answer_en: 'You can request a refund within 14 days of purchase. The refund process is completed within 3-5 business days.',
    category: 'ödeme',
    sort_order: 4,
    is_active: true,
    view_count: 543,
    created_by: 'usr_12OPQR8901234567STUV',
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'faq_05GHIJ5678901234KLMN',
    question_tr: 'Tapu ve imar durumu kontrolü yapılıyor mu?',
    question_en: 'Are title deed and zoning checks performed?',
    answer_tr: 'Platformumuz tapu ve imar durumu doğrulaması yapmamaktadır. Alıcıların ilgili tapu müdürlüğünden kontrol etmesini öneriyoruz.',
    answer_en: 'Our platform does not perform title deed and zoning verification. We recommend buyers check with the relevant land registry office.',
    category: 'güvenlik',
    sort_order: 5,
    is_active: true,
    view_count: 321,
    created_by: 'usr_12OPQR8901234567STUV',
    created_at: '2025-09-01T00:00:00.000Z',
    updated_at: '2026-03-15T00:00:00.000Z',
  },
  {
    id: 'faq_06OPQR6789012345STUV',
    question_tr: 'Hesabımı nasıl silebilirim?',
    question_en: 'How can I delete my account?',
    answer_tr: 'Hesap silme işlemi için destek@aperant.com adresine e-posta gönderebilirsiniz. İşlem 7 iş günü içinde tamamlanır.',
    answer_en: 'To delete your account, send an email to support@aperant.com. The process will be completed within 7 business days.',
    category: 'hesap',
    sort_order: 6,
    is_active: false,
    view_count: 89,
    created_by: 'usr_12OPQR8901234567STUV',
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-02-01T00:00:00.000Z',
  },
];

/** @type {import('@/models/BlogPost.js').BlogPostResponse[]} */
export const blogPosts = [
  {
    id: 'blog_01ABCD1234567890EFGH',
    title_tr: 'Arsa Yatırımında Dikkat Edilmesi Gerekenler',
    title_en: 'Things to Consider in Land Investment',
    slug: 'arsa-yatiriminda-dikkat-edilmesi-gerekenler',
    content_tr: 'Arsa yatırımı yaparken imar durumu, ulaşım altyapısı ve bölgenin gelecekteki değer artış potansiyeli en önemli faktörlerdir. Bu yazımızda arsa yatırımında dikkat edilmesi gereken 10 kritik noktayı inceliyoruz.',
    content_en: 'When investing in land, zoning status, transportation infrastructure, and the area\'s future value appreciation potential are the most important factors. In this article, we examine 10 critical points to consider in land investment.',
    excerpt_tr: 'Arsa yatırımında dikkat edilmesi gereken 10 kritik nokta.',
    excerpt_en: '10 critical points to consider in land investment.',
    cover_image_url: '/images/blog/arsa-yatirim.jpg',
    tags: ['yatırım', 'arsa', 'imar', 'gayrimenkul'],
    status: 'published',
    is_featured: true,
    author_id: 'usr_12OPQR8901234567STUV',
    author: { id: 'usr_12OPQR8901234567STUV', first_name: 'Selin', last_name: 'Aktaş' },
    view_count: 2345,
    published_at: '2026-03-15T10:00:00.000Z',
    created_at: '2026-03-10T08:00:00.000Z',
    updated_at: '2026-04-01T12:00:00.000Z',
  },
  {
    id: 'blog_02IJKL2345678901MNOP',
    title_tr: '2026 Türkiye Emlak Piyasası Değerlendirmesi',
    title_en: '2026 Turkey Real Estate Market Assessment',
    slug: '2026-turkiye-emlak-piyasasi-degerlendirmesi',
    content_tr: '2026 yılı Türkiye emlak piyasasında önemli gelişmelere sahne oluyor. Faiz oranlarındaki düşüş ve kentsel dönüşüm projeleri arsa fiyatlarını olumlu etkiliyor.',
    content_en: '2026 is witnessing significant developments in Turkey\'s real estate market. Declining interest rates and urban transformation projects are positively affecting land prices.',
    excerpt_tr: '2026 yılı Türkiye emlak piyasası analizi.',
    excerpt_en: '2026 Turkey real estate market analysis.',
    cover_image_url: '/images/blog/emlak-piyasasi.jpg',
    tags: ['piyasa', 'analiz', '2026', 'gayrimenkul'],
    status: 'published',
    is_featured: false,
    author_id: 'usr_12OPQR8901234567STUV',
    author: { id: 'usr_12OPQR8901234567STUV', first_name: 'Selin', last_name: 'Aktaş' },
    view_count: 1567,
    published_at: '2026-04-01T09:00:00.000Z',
    created_at: '2026-03-28T14:00:00.000Z',
    updated_at: '2026-04-05T10:00:00.000Z',
  },
  {
    id: 'blog_03QRST3456789012UVWX',
    title_tr: 'Tarla Alırken Hukuki Süreç Rehberi',
    title_en: 'Legal Process Guide for Buying Agricultural Land',
    slug: 'tarla-alirken-hukuki-surec-rehberi',
    content_tr: 'Tarla satın alma süreci konut alımından farklı hukuki prosedürler içerir. Tarım arazisi vasfı, toprak koruma kanunu ve ön alım hakkı gibi konulara dikkat edilmelidir.',
    content_en: 'The process of buying agricultural land involves different legal procedures than residential purchases. Attention should be paid to agricultural land status, soil conservation law, and preemption rights.',
    excerpt_tr: 'Tarla alım satımında hukuki süreç ve dikkat edilmesi gerekenler.',
    excerpt_en: 'Legal process and considerations in agricultural land transactions.',
    cover_image_url: '/images/blog/tarla-hukuki.jpg',
    tags: ['hukuk', 'tarla', 'tapu', 'mevzuat'],
    status: 'draft',
    is_featured: false,
    author_id: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    author: { id: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z', first_name: 'Ahmet', last_name: 'Yılmaz' },
    view_count: 0,
    published_at: null,
    created_at: '2026-04-18T16:00:00.000Z',
    updated_at: '2026-04-19T09:00:00.000Z',
  },
  {
    id: 'blog_04YZAB4567890123CDEF',
    title_tr: 'İstanbul Yatırım Bölgeleri Haritası',
    title_en: 'Istanbul Investment Zones Map',
    slug: 'istanbul-yatirim-bolgeleri-haritasi',
    content_tr: 'İstanbul\'un gelişen bölgelerinde arsa yatırımı yapmak isteyenler için bölge bazlı analiz. Silivri, Tuzla ve Pendik bölgeleri değerlendirildi.',
    content_en: 'Region-based analysis for those wanting to invest in land in Istanbul\'s developing areas. Silivri, Tuzla, and Pendik regions evaluated.',
    excerpt_tr: 'İstanbul yatırımlık arsa bölgeleri analizi.',
    excerpt_en: 'Analysis of Istanbul investment land zones.',
    cover_image_url: '/images/blog/istanbul-yatirim.jpg',
    tags: ['İstanbul', 'yatırım', 'bölge', 'analiz'],
    status: 'archived',
    is_featured: false,
    author_id: 'usr_12OPQR8901234567STUV',
    author: { id: 'usr_12OPQR8901234567STUV', first_name: 'Selin', last_name: 'Aktaş' },
    view_count: 3456,
    published_at: '2025-11-01T08:00:00.000Z',
    created_at: '2025-10-25T10:00:00.000Z',
    updated_at: '2026-03-01T00:00:00.000Z',
  },
];

/**
 * Counter for generating unique IDs for newly created banners.
 * @type {{ value: number }}
 */
export const bannerIdCounter = { value: 100 };

/**
 * Generates a unique banner ID.
 * @returns {string}
 */
export function generateBannerId() {
  bannerIdCounter.value += 1;
  return `bnr_new_${String(bannerIdCounter.value).padStart(6, '0')}`;
}

/**
 * Counter for generating unique IDs for newly created FAQs.
 * @type {{ value: number }}
 */
export const faqIdCounter = { value: 100 };

/**
 * Generates a unique FAQ ID.
 * @returns {string}
 */
export function generateFaqId() {
  faqIdCounter.value += 1;
  return `faq_new_${String(faqIdCounter.value).padStart(6, '0')}`;
}

/**
 * Counter for generating unique IDs for newly created blog posts.
 * @type {{ value: number }}
 */
export const blogPostIdCounter = { value: 100 };

/**
 * Generates a unique blog post ID.
 * @returns {string}
 */
export function generateBlogPostId() {
  blogPostIdCounter.value += 1;
  return `blog_new_${String(blogPostIdCounter.value).padStart(6, '0')}`;
}
