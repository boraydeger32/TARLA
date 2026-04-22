/**
 * MSW handlers for content endpoints.
 * Simulates CRUD for /content/banners, /content/faqs, /content/blog.
 * All handlers include 200-600ms simulated latency.
 *
 * Response shapes match FastAPI PaginatedResponse<T> exactly.
 * Error responses follow FastAPI format: { "detail": "..." }
 *
 * @module mocks/handlers/content
 */

import { http, HttpResponse, delay } from 'msw';

import {
  banners,
  faqs,
  blogPosts,
  generateBannerId,
  generateFaqId,
  generateBlogPostId,
} from '../fixtures/content.js';

/**
 * Simulates realistic network latency (200-600ms).
 * @returns {Promise<void>}
 */
function simulateLatency() {
  return delay(Math.random() * 400 + 200);
}

/** @type {import('@/models/Banner.js').BannerResponse[]} */
let bannersData = [...banners];

/** @type {import('@/models/FAQ.js').FAQResponse[]} */
let faqsData = [...faqs];

/** @type {import('@/models/BlogPost.js').BlogPostResponse[]} */
let blogPostsData = [...blogPosts];

/**
 * Generic paginate + filter helper.
 * @param {any[]} data
 * @param {URLSearchParams} params
 * @param {(item: any, term: string) => boolean} searchFn
 * @returns {{ items: any[], total: number, page: number, size: number, pages: number }}
 */
function paginateAndFilter(data, params, searchFn) {
  let filtered = [...data];

  const search = params.get('search');
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter((item) => searchFn(item, term));
  }

  const isActive = params.get('is_active');
  if (isActive !== null && isActive !== undefined && isActive !== '') {
    const active = isActive === 'true';
    filtered = filtered.filter((item) => item.is_active === active);
  }

  const status = params.get('status');
  if (status && status !== 'all' && filtered[0] && 'status' in filtered[0]) {
    filtered = filtered.filter((item) => item.status === status);
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

  const page = Number(params.get('page') ?? 1);
  const size = Number(params.get('size') ?? 25);
  const start = (page - 1) * size;
  const items = filtered.slice(start, start + size);

  return {
    items,
    total: filtered.length,
    page,
    size,
    pages: Math.ceil(filtered.length / size),
  };
}

/**
 * Content MSW request handlers.
 * @type {import('msw').HttpHandler[]}
 */
export const contentHandlers = [
  // ── Banners ────────────────────────────────────────────────

  /**
   * GET /content/banners — paginated list with filtering.
   */
  http.get('*/api/v1/content/banners', async ({ request }) => {
    await simulateLatency();
    const url = new URL(request.url);
    const result = paginateAndFilter(bannersData, url.searchParams, (b, term) =>
      b.title_tr.toLowerCase().includes(term) || b.title_en.toLowerCase().includes(term),
    );
    return HttpResponse.json(result);
  }),

  /**
   * GET /content/banners/:id — single banner detail.
   */
  http.get('*/api/v1/content/banners/:id', async ({ params }) => {
    await simulateLatency();
    const banner = bannersData.find((b) => b.id === params.id);
    if (!banner) {
      return HttpResponse.json({ detail: 'Banner not found' }, { status: 404 });
    }
    return HttpResponse.json(banner);
  }),

  /**
   * POST /content/banners — create a new banner.
   */
  http.post('*/api/v1/content/banners', async ({ request }) => {
    await simulateLatency();
    const body = await request.json();

    if (!body.title_tr || !body.title_en || !body.image_url || !body.position) {
      return HttpResponse.json(
        { detail: 'Missing required fields: title_tr, title_en, image_url, position' },
        { status: 422 },
      );
    }

    const now = new Date().toISOString();
    const newBanner = {
      id: generateBannerId(),
      title_tr: body.title_tr,
      title_en: body.title_en,
      subtitle_tr: body.subtitle_tr ?? null,
      subtitle_en: body.subtitle_en ?? null,
      image_url: body.image_url,
      link_url: body.link_url ?? null,
      position: body.position,
      sort_order: body.sort_order ?? 0,
      is_active: body.is_active ?? true,
      starts_at: body.starts_at ?? null,
      ends_at: body.ends_at ?? null,
      click_count: 0,
      impression_count: 0,
      created_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
      created_at: now,
      updated_at: now,
    };

    bannersData.unshift(newBanner);
    return HttpResponse.json(newBanner, { status: 201 });
  }),

  /**
   * PATCH /content/banners/:id — update a banner.
   */
  http.patch('*/api/v1/content/banners/:id', async ({ params, request }) => {
    await simulateLatency();
    const index = bannersData.findIndex((b) => b.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ detail: 'Banner not found' }, { status: 404 });
    }
    const body = await request.json();
    bannersData[index] = { ...bannersData[index], ...body, updated_at: new Date().toISOString() };
    return HttpResponse.json(bannersData[index]);
  }),

  /**
   * DELETE /content/banners/:id — delete a banner.
   */
  http.delete('*/api/v1/content/banners/:id', async ({ params }) => {
    await simulateLatency();
    const index = bannersData.findIndex((b) => b.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ detail: 'Banner not found' }, { status: 404 });
    }
    bannersData.splice(index, 1);
    return HttpResponse.json({ detail: 'Banner deleted successfully' });
  }),

  // ── FAQs ───────────────────────────────────────────────────

  /**
   * GET /content/faqs — paginated list with filtering.
   */
  http.get('*/api/v1/content/faqs', async ({ request }) => {
    await simulateLatency();
    const url = new URL(request.url);

    let filtered = [...faqsData];

    const category = url.searchParams.get('category');
    if (category) {
      filtered = filtered.filter((f) => f.category === category);
    }

    const search = url.searchParams.get('search');
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.question_tr.toLowerCase().includes(term) ||
          f.question_en.toLowerCase().includes(term) ||
          f.answer_tr.toLowerCase().includes(term),
      );
    }

    const isActive = url.searchParams.get('is_active');
    if (isActive !== null && isActive !== undefined && isActive !== '') {
      const active = isActive === 'true';
      filtered = filtered.filter((f) => f.is_active === active);
    }

    const sortBy = url.searchParams.get('sort_by') ?? 'sort_order';
    const sortOrder = url.searchParams.get('sort_order') ?? 'asc';
    filtered.sort((a, b) => {
      const aVal = a[sortBy] ?? '';
      const bVal = b[sortBy] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal), 'tr');
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
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
   * GET /content/faqs/:id — single FAQ detail.
   */
  http.get('*/api/v1/content/faqs/:id', async ({ params }) => {
    await simulateLatency();
    const faq = faqsData.find((f) => f.id === params.id);
    if (!faq) {
      return HttpResponse.json({ detail: 'FAQ not found' }, { status: 404 });
    }
    return HttpResponse.json(faq);
  }),

  /**
   * POST /content/faqs — create a new FAQ.
   */
  http.post('*/api/v1/content/faqs', async ({ request }) => {
    await simulateLatency();
    const body = await request.json();

    if (!body.question_tr || !body.question_en || !body.answer_tr || !body.answer_en) {
      return HttpResponse.json(
        { detail: 'Missing required fields: question_tr, question_en, answer_tr, answer_en' },
        { status: 422 },
      );
    }

    const now = new Date().toISOString();
    const newFaq = {
      id: generateFaqId(),
      question_tr: body.question_tr,
      question_en: body.question_en,
      answer_tr: body.answer_tr,
      answer_en: body.answer_en,
      category: body.category ?? null,
      sort_order: body.sort_order ?? 0,
      is_active: body.is_active ?? true,
      view_count: 0,
      created_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
      created_at: now,
      updated_at: now,
    };

    faqsData.unshift(newFaq);
    return HttpResponse.json(newFaq, { status: 201 });
  }),

  /**
   * PATCH /content/faqs/:id — update a FAQ.
   */
  http.patch('*/api/v1/content/faqs/:id', async ({ params, request }) => {
    await simulateLatency();
    const index = faqsData.findIndex((f) => f.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ detail: 'FAQ not found' }, { status: 404 });
    }
    const body = await request.json();
    faqsData[index] = { ...faqsData[index], ...body, updated_at: new Date().toISOString() };
    return HttpResponse.json(faqsData[index]);
  }),

  /**
   * DELETE /content/faqs/:id — delete a FAQ.
   */
  http.delete('*/api/v1/content/faqs/:id', async ({ params }) => {
    await simulateLatency();
    const index = faqsData.findIndex((f) => f.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ detail: 'FAQ not found' }, { status: 404 });
    }
    faqsData.splice(index, 1);
    return HttpResponse.json({ detail: 'FAQ deleted successfully' });
  }),

  // ── Blog Posts ─────────────────────────────────────────────

  /**
   * GET /content/blog — paginated list with filtering.
   */
  http.get('*/api/v1/content/blog', async ({ request }) => {
    await simulateLatency();
    const url = new URL(request.url);
    const result = paginateAndFilter(blogPostsData, url.searchParams, (p, term) =>
      p.title_tr.toLowerCase().includes(term) ||
      p.title_en.toLowerCase().includes(term) ||
      p.slug.toLowerCase().includes(term),
    );
    return HttpResponse.json(result);
  }),

  /**
   * GET /content/blog/:id — single blog post detail.
   */
  http.get('*/api/v1/content/blog/:id', async ({ params }) => {
    await simulateLatency();
    const post = blogPostsData.find((p) => p.id === params.id);
    if (!post) {
      return HttpResponse.json({ detail: 'Blog post not found' }, { status: 404 });
    }
    return HttpResponse.json(post);
  }),

  /**
   * POST /content/blog — create a new blog post.
   */
  http.post('*/api/v1/content/blog', async ({ request }) => {
    await simulateLatency();
    const body = await request.json();

    if (!body.title_tr || !body.title_en || !body.slug || !body.content_tr || !body.content_en) {
      return HttpResponse.json(
        { detail: 'Missing required fields: title_tr, title_en, slug, content_tr, content_en' },
        { status: 422 },
      );
    }

    const existing = blogPostsData.find((p) => p.slug === body.slug);
    if (existing) {
      return HttpResponse.json(
        { detail: 'A blog post with this slug already exists' },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const newPost = {
      id: generateBlogPostId(),
      title_tr: body.title_tr,
      title_en: body.title_en,
      slug: body.slug,
      content_tr: body.content_tr,
      content_en: body.content_en,
      excerpt_tr: body.excerpt_tr ?? null,
      excerpt_en: body.excerpt_en ?? null,
      cover_image_url: body.cover_image_url ?? null,
      tags: body.tags ?? [],
      status: body.status ?? 'draft',
      is_featured: body.is_featured ?? false,
      author_id: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
      author: { id: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z', first_name: 'Ahmet', last_name: 'Yılmaz' },
      view_count: 0,
      published_at: body.status === 'published' ? now : null,
      created_at: now,
      updated_at: now,
    };

    blogPostsData.unshift(newPost);
    return HttpResponse.json(newPost, { status: 201 });
  }),

  /**
   * PATCH /content/blog/:id — update a blog post.
   */
  http.patch('*/api/v1/content/blog/:id', async ({ params, request }) => {
    await simulateLatency();
    const index = blogPostsData.findIndex((p) => p.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ detail: 'Blog post not found' }, { status: 404 });
    }
    const body = await request.json();
    const now = new Date().toISOString();

    const updated = { ...blogPostsData[index], ...body, updated_at: now };

    if (body.status === 'published' && !blogPostsData[index].published_at) {
      updated.published_at = now;
    }

    blogPostsData[index] = updated;
    return HttpResponse.json(blogPostsData[index]);
  }),

  /**
   * DELETE /content/blog/:id — delete a blog post.
   */
  http.delete('*/api/v1/content/blog/:id', async ({ params }) => {
    await simulateLatency();
    const index = blogPostsData.findIndex((p) => p.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ detail: 'Blog post not found' }, { status: 404 });
    }
    blogPostsData.splice(index, 1);
    return HttpResponse.json({ detail: 'Blog post deleted successfully' });
  }),
];
