import { useQuery } from '@tanstack/react-query';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http'
import { WithPagination } from 'src/utils/types';
import type { RequestStats, RequestSummary, RequestSummaryCompany } from '../types';

// Total Request
async function fetchRequestSummary() {
  const { data } = await http<{ data: RequestSummary }>(`dashboard-general/request-summary`);

  return data;
}

export function useRequestSummary() {
  const data = useQuery(['request-summary'], () => fetchRequestSummary());

  return data;
}


// Total Request

export function fetchRequestSummaryCompany(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/dashboard-general/request-summary-company', baseUrl);

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
    ['request-summary-company'],
    (paginationState) => fetchRequestSummaryCompany({ ...params, ...paginationState })
  );
}

// Total Request
async function fetchRequestStats() {
  const { data } = await http<{ data: RequestStats[] }>(`dashboard-general/request-stats`);

  return data;
}

export function useRequestStats() {
  const data = useQuery(['request-stats'], () => fetchRequestStats());

  return data;
}