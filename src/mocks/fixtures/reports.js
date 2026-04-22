/**
 * Reports fixture data — moderation reports submitted by users.
 * Targets listings and users with Turkish descriptions.
 * Matches ReportResponseSchema.
 *
 * @module mocks/fixtures/reports
 */

/** @type {import('@/models/Report.js').ReportResponse[]} */
export const reports = [
  {
    id: 'rpt_01ABCD1234567890EFGH',
    reason: 'Sahte ilan',
    description: 'İlandaki fotoğraflar başka bir arsaya ait görünüyor. Konum bilgisi de yanlış.',
    target_type: 'listing',
    target_id: 'lst_01HQXK9A1B2C3D4E5F6G7H8J',
    status: 'pending',
    reporter_id: 'usr_03RSTU9012345678VWXY',
    reporter: { id: 'usr_03RSTU9012345678VWXY', first_name: 'Ayşe', last_name: 'Demir' },
    target: { id: 'lst_01HQXK9A1B2C3D4E5F6G7H8J', title: 'Silivri Merkez Satılık Arsa 500 m²' },
    resolution_note: null,
    action_taken: null,
    reviewed_by: null,
    reviewed_at: null,
    created_at: '2026-04-18T14:30:00.000Z',
    updated_at: '2026-04-18T14:30:00.000Z',
  },
  {
    id: 'rpt_02IJKL2345678901MNOP',
    reason: 'Uygunsuz içerik',
    description: 'İlan açıklamasında hakaret ve küfür içeren ifadeler bulunmaktadır.',
    target_type: 'listing',
    target_id: 'lst_04PQRS4567890123TUVW',
    status: 'pending',
    reporter_id: 'usr_05XYZA5678901234BCDE',
    reporter: { id: 'usr_05XYZA5678901234BCDE', first_name: 'Ali', last_name: 'Özkan' },
    target: { id: 'lst_04PQRS4567890123TUVW', title: 'Beykoz Orman Cepheli Tarla 5000 m²' },
    resolution_note: null,
    action_taken: null,
    reviewed_by: null,
    reviewed_at: null,
    created_at: '2026-04-19T09:15:00.000Z',
    updated_at: '2026-04-19T09:15:00.000Z',
  },
  {
    id: 'rpt_03QRST3456789012UVWX',
    reason: 'Dolandırıcılık şüphesi',
    description: 'Bu kullanıcı birden fazla sahte ilan paylaşmış ve ön ödeme talep ediyor.',
    target_type: 'user',
    target_id: 'usr_09JKLM3456789012NOPQ',
    status: 'actioned',
    reporter_id: 'usr_02ABCD1234567890EFGH',
    reporter: { id: 'usr_02ABCD1234567890EFGH', first_name: 'Mehmet', last_name: 'Kaya' },
    target: { id: 'usr_09JKLM3456789012NOPQ', first_name: 'Mustafa', last_name: 'Aydın' },
    resolution_note: 'Kullanıcı hesabı incelendi ve sahte ilan paylaşımı doğrulandı.',
    action_taken: 'Kullanıcı hesabı askıya alındı (90 gün). Tüm ilanları kaldırıldı.',
    reviewed_by: 'usr_01HQXK8V3W2M5N7P9R1T3Y6Z',
    reviewed_at: '2026-04-10T12:00:00.000Z',
    created_at: '2026-04-08T16:00:00.000Z',
    updated_at: '2026-04-10T12:00:00.000Z',
  },
  {
    id: 'rpt_04YZAB4567890123CDEF',
    reason: 'Yanlış fiyat bilgisi',
    description: 'İlandaki fiyat gerçek piyasa değerinin çok altında, aldatıcı olabilir.',
    target_type: 'listing',
    target_id: 'lst_07LMNO0123456789PQRS',
    status: 'dismissed',
    reporter_id: 'usr_06NOPQ7890123456RSTU',
    reporter: { id: 'usr_06NOPQ7890123456RSTU', first_name: 'Hasan', last_name: 'Çelik' },
    target: { id: 'lst_07LMNO0123456789PQRS', title: 'Tuzla Sahil Yolu Karma İmarlı 2000 m²' },
    resolution_note: 'Fiyat bilgisi ilan sahibi tarafından doğrulandı. Rapor reddedildi.',
    action_taken: null,
    reviewed_by: 'usr_11GHIJ7890123456KLMN',
    reviewed_at: '2026-04-16T10:00:00.000Z',
    created_at: '2026-04-15T08:20:00.000Z',
    updated_at: '2026-04-16T10:00:00.000Z',
  },
  {
    id: 'rpt_05GHIJ5678901234KLMN',
    reason: 'Tekrarlanan ilan',
    description: 'Aynı arsa farklı hesaplardan birden fazla kez ilanlanmış.',
    target_type: 'listing',
    target_id: 'lst_02JKLM5678901234NOPQ',
    status: 'reviewed',
    reporter_id: 'usr_04HIJK3456789012LMNO',
    reporter: { id: 'usr_04HIJK3456789012LMNO', first_name: 'Fatma', last_name: 'Yıldırım' },
    target: { id: 'lst_02JKLM5678901234NOPQ', title: 'Çankaya Yıldız Mahallesi Ticari Arsa 1200 m²' },
    resolution_note: 'İncelemeye alındı; tekrar kontrolü devam ediyor.',
    action_taken: null,
    reviewed_by: 'usr_11GHIJ7890123456KLMN',
    reviewed_at: '2026-04-19T15:00:00.000Z',
    created_at: '2026-04-17T11:30:00.000Z',
    updated_at: '2026-04-19T15:00:00.000Z',
  },
  {
    id: 'rpt_06OPQR6789012345STUV',
    reason: 'Kişisel bilgi paylaşımı',
    description: 'Kullanıcı ilan açıklamasında T.C. kimlik numarası paylaşmış.',
    target_type: 'listing',
    target_id: 'lst_11PQRS7890123456TUVW',
    status: 'pending',
    reporter_id: 'usr_08TUVW1234567890XYZA',
    reporter: { id: 'usr_08TUVW1234567890XYZA', first_name: 'Emre', last_name: 'Koç' },
    target: { id: 'lst_11PQRS7890123456TUVW', title: 'Etimesgut Devlet Yolu Üzeri 1000 m²' },
    resolution_note: null,
    action_taken: null,
    reviewed_by: null,
    reviewed_at: null,
    created_at: '2026-04-20T08:00:00.000Z',
    updated_at: '2026-04-20T08:00:00.000Z',
  },
];

/**
 * Counter for generating unique IDs for newly created reports.
 * @type {{ value: number }}
 */
export const reportIdCounter = { value: 100 };

/**
 * Generates a unique report ID.
 * @returns {string}
 */
export function generateReportId() {
  reportIdCounter.value += 1;
  return `rpt_new_${String(reportIdCounter.value).padStart(6, '0')}`;
}
