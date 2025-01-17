import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import type { RequestStatusSummary } from './types';

async function fetchRequestStatusSummary(companyId: string) {
  const { data } = await http<{ data: RequestStatusSummary[] }>(`requests-status-summary?internal_company_id=${companyId}`);

  return data;
}

export function useRequestStatusSummary(companyId: string, options: any = {}) {
  const data = useQuery(['request-status-summary', companyId], () => fetchRequestStatusSummary(companyId), {
    enabled: companyId !== undefined,
    ...options,
  });

  return data;
}
