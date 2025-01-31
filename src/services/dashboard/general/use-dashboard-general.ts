import { PickersOutlinedInput } from '@mui/x-date-pickers';
import { useQuery } from '@tanstack/react-query';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http'
import { WithPagination } from 'src/utils/types';
import type { RequestStats, RequestSummary, RequestSummaryCompany } from '../types';

// Total Request
async function fetchRequestSummary(period: string) {
  const { data } = await http<{ data: RequestSummary }>(`dashboard-general/request-summary?period=${period}`);

  return data;
}

export function useRequestSummary(period: string) {
  const data = useQuery(['request-summary', period], () => fetchRequestSummary(period));

  return data;
}


// Total Request

export function fetchRequestSummaryCompany(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/dashboard-general/request-summary-company', baseUrl);


  if (params.period) {
    endpointUrl.searchParams.append('period', params.period);
  }
  
  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,
    filterValues: [params.order],
    ...params,
  });


  return http<WithPagination<RequestSummaryCompany>>(
    endpointUrl.toString().replace(baseUrl, '')
  );
}

export function useRequestSummaryCompany(params: Partial<any> ) {
  return usePaginationQuery(
    ['request-summary-company', params.period],
    (paginationState) => fetchRequestSummaryCompany({ ...params, ...paginationState })
  );
}

// Total Request
async function fetchRequestStats(period: string) {
  const { data } = await http<{ data: RequestStats[] }>(`dashboard-general/request-stats?period=${period}`);

  return data;
}

export function useRequestStats(period: string) {
  const data = useQuery(['request-stats', period], () => fetchRequestStats(period));

  return data;
}