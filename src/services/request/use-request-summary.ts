import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import type { RequestSummary } from './types';

async function fetchRequestSummary(companyId: string) {
  const { data } = await http<{ data: RequestSummary }>(`requests-summary?internal_company_id=${companyId}`);

  return data;
}

export function useRequestSummary(companyId: string, options: any = {}) {
  const data = useQuery(['request-summary', companyId], () => fetchRequestSummary(companyId), {
    enabled: companyId !== undefined,
    ...options,
  });

  return data;
}
