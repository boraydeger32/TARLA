/**
 * Dashboard page Alpine data factory.
 * Fetches stats, chart data, and recent activity via query observers.
 * Renders stat cards, 4 chart types (line, pie, bar, area), and activity feed.
 *
 * @module views/dashboard/dashboard
 */

import {
  dashboardStatsObserver,
  dashboardChartsObserver,
  dashboardRecentActivityObserver,
} from '@/queries/dashboardQueries.js';

// ── Activity action → color mapping ─────────────────────────

/** @type {Readonly<Record<string, string>>} */
const ACTIVITY_COLORS = Object.freeze({
  'listing.approve': 'text-green-500 bg-green-100 dark:bg-green-900/30',
  'listing.create': 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  'listing.reject': 'text-red-500 bg-red-100 dark:bg-red-900/30',
  'user.ban': 'text-red-500 bg-red-100 dark:bg-red-900/30',
  'user.role_change': 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30',
  'report.action': 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
  'setting.update': 'text-gray-500 bg-gray-100 dark:bg-gray-700/50',
  'category.create': 'text-teal-500 bg-teal-100 dark:bg-teal-900/30',
  'content.publish': 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30',
  'transaction.refund': 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
});

/** @type {string} */
const DEFAULT_ACTIVITY_COLOR = 'text-gray-500 bg-gray-100 dark:bg-gray-700/50';

// ── Helpers ──────────────────────────────────────────────────

/**
 * Formats a currency value as Turkish Lira.
 *
 * @param {number} amount - Amount in TRY
 * @returns {string} Formatted price string (e.g. "₺45.750")
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats an ISO date string as a relative time expression.
 *
 * @param {string} isoString - ISO 8601 date string
 * @returns {string} Human-readable relative time
 */
function formatRelativeTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return 'Az önce';
  if (diffMin < 60) return `${diffMin} dk önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 7) return `${diffDays} gün önce`;

  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

// ── Alpine Data Factory ─────────────────────────────────────

/**
 * Alpine data factory for the dashboard page.
 * Registered as Alpine.data('dashboardPage', dashboardPage).
 *
 * @returns {import('alpinejs').AlpineComponent}
 */
export function dashboardPage() {
  return {
    /** @type {object|null} Dashboard stat card data */
    stats: null,

    /** @type {object|null} Dashboard charts data */
    charts: null,

    /** @type {Array<object>} Recent activity items */
    activities: [],

    /** @type {number} Total activity count */
    activitiesTotal: 0,

    /** @type {{ stats: boolean, charts: boolean, activities: boolean }} Loading flags */
    loading: { stats: true, charts: true, activities: true },

    /** @type {Error|null} Last error encountered */
    error: null,

    /** @private @type {Function|null} */
    _unsubStats: null,
    /** @private @type {Function|null} */
    _unsubCharts: null,
    /** @private @type {Function|null} */
    _unsubActivities: null,

    /**
     * Alpine init lifecycle — subscribes to all dashboard query observers.
     */
    init() {
      this._subscribeStats();
      this._subscribeCharts();
      this._subscribeActivities();
    },

    /**
     * Subscribes to dashboard stats observer.
     * @private
     */
    _subscribeStats() {
      const observer = dashboardStatsObserver();
      this._unsubStats = observer.subscribe((result) => {
        this.stats = result.data ?? null;
        this.loading.stats = result.isLoading;
        if (result.error) this.error = result.error;
      });
    },

    /**
     * Subscribes to dashboard charts observer.
     * @private
     */
    _subscribeCharts() {
      const observer = dashboardChartsObserver('last_6m');
      this._unsubCharts = observer.subscribe((result) => {
        this.charts = result.data ?? null;
        this.loading.charts = result.isLoading;
        if (result.error) this.error = result.error;
      });
    },

    /**
     * Subscribes to dashboard recent activity observer.
     * @private
     */
    _subscribeActivities() {
      const observer = dashboardRecentActivityObserver();
      this._unsubActivities = observer.subscribe((result) => {
        this.activities = result.data?.items ?? [];
        this.activitiesTotal = result.data?.total ?? 0;
        this.loading.activities = result.isLoading;
        if (result.error) this.error = result.error;
      });
    },

    /**
     * Returns the formatted display value for a stat card.
     *
     * @param {string} key - Stats key (e.g. 'active_listings', 'revenue')
     * @param {boolean} [isCurrency=false] - Whether to format as currency
     * @returns {string|number} Formatted stat value
     */
    getStatValue(key, isCurrency = false) {
      if (!this.stats) return '—';
      const stat = this.stats[key];
      if (!stat) return '—';
      if (isCurrency) return formatCurrency(stat.value);
      return stat.value;
    },

    /**
     * Returns the percentage change for a stat key.
     *
     * @param {string} key - Stats key
     * @returns {number} Change percentage
     */
    getStatChange(key) {
      if (!this.stats) return 0;
      return this.stats[key]?.change ?? 0;
    },

    /**
     * Returns the CSS color classes for an activity action type.
     *
     * @param {string} action - Activity action identifier (e.g. 'listing.approve')
     * @returns {string} Tailwind CSS classes
     */
    getActivityColor(action) {
      return ACTIVITY_COLORS[action] ?? DEFAULT_ACTIVITY_COLOR;
    },

    /**
     * Returns a relative time string for an activity timestamp.
     *
     * @param {string} isoString - ISO 8601 date string
     * @returns {string} Relative time expression
     */
    getActivityTime(isoString) {
      return formatRelativeTime(isoString);
    },

    /**
     * Returns the user display name for an activity entry.
     *
     * @param {object} activity - Activity object with user property
     * @returns {string} Full name
     */
    getActivityUser(activity) {
      const { first_name, last_name } = activity.user;
      return `${first_name} ${last_name}`;
    },

    /**
     * Alpine destroy lifecycle — unsubscribes from all query observers.
     */
    destroy() {
      this._unsubStats?.();
      this._unsubCharts?.();
      this._unsubActivities?.();
    },
  };
}
