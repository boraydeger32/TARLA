/**
 * Shared @tanstack/query-core client singleton.
 * Defaults per design.md: 60s stale time, single retry, no refetch on focus.
 *
 * @module queries/queryClient
 */

import { QueryClient } from '@tanstack/query-core';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
