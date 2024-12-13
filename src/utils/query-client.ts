import { QueryClient } from '@tanstack/react-query';
import { HttpError } from './http';

const MAX_RETRY = 3;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof HttpError && error.status === 404) {
          return false;
        }
        if (failureCount < MAX_RETRY + 1) {
          return true;
        }
        return false
      },
    },
  },
});
