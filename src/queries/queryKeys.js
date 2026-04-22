/**
 * Central query key factory per domain.
 * Expands as new modules arrive.
 *
 * @module queries/queryKeys
 */

export const queryKeys = {
  dashboard: {
    all: () => ['dashboard'],
    stats: () => ['dashboard', 'stats'],
    charts: (period) => ['dashboard', 'charts', period],
    recentActivity: () => ['dashboard', 'recent-activity'],
  },
};
