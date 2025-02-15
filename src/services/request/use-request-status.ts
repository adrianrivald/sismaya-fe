import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import type { RequestStatus } from './types';

async function fetchRequestStatus(companyId: string) {
  const { data } = await http<{ data: RequestStatus[] }>(`progress-status?company_id=${companyId}`);

  return data;
}

export function useRequestStatus(companyId: string, options: any = {}) {
  const data = useQuery(['request-status', companyId], () => fetchRequestStatus(companyId), {
    enabled: companyId !== undefined,
    ...options,
  });

  return data;
}
