import { useQuery } from '@tanstack/react-query';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http'
import { WithPagination } from 'src/utils/types';
import type { ClientTotalRequest, ClientTotalRequestByState, PendingRequest } from '../types';

// Total Request
async function fetchTotalRequest(dateFrom: string, dateTo: string) {
  const { data } = await http<{ data: ClientTotalRequest }>(`dashboard-client/total-request?from=${dateFrom}&to=${dateTo}`);

  return data;
}

export function useClientTotalRequest(dateFrom: string, dateTo: string) {
  const data = useQuery(['client-total-request', dateFrom], () => fetchTotalRequest(dateFrom, dateTo));

  return data;
}


// Total Request By State
async function fetchTotalRequestByState(dateFrom: string, dateTo: string) {
    const { data } = await http<{ data: ClientTotalRequestByState }>(`dashboard-client/total-request-by-state?from=${dateFrom}&to=${dateTo}`);
  
    return data;
  }
  
  export function useClientTotalRequestByState(dateFrom: string, dateTo: string) {
    const data = useQuery(['client-total-request-by-state', dateFrom], () => fetchTotalRequestByState(dateFrom, dateTo));
  
    return data;
  }

// Request Pending

async function fetchTotalRequestOverTime() {
    const { data } = await http<{ data: PendingRequest }>(`dashboard-client/request-pending`);
  
    return data;
  }
  
  export function usePendingRequest() {
    const data = useQuery(['client-pending-request'], () => fetchTotalRequestOverTime());
  
    return data;
  }

  // Unresolved CITO


export function fetchUnresolvedCito(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/dashboard-client/unresolved-cito', baseUrl);

  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,
    filterValues: [params.order],
    ...params,
  });


  return http<WithPagination<any>>(
    endpointUrl.toString().replace(baseUrl, '')
  );
}

export function useUnresolvedCito(params: Partial<any> ) {
  return usePaginationQuery(
    ['unresolved-cito', params.keyword],
    (paginationState) => fetchUnresolvedCito({ ...params, ...paginationState })
  );
}
  

// Total Request Overtime

async function fetchTotalRequestOvertime() {
  const { data } = await http<{ data: any }>(`dashboard-client/total-request-over-time`);

  return data;
}

export function useTotalRequestOvertime() {
  const data = useQuery(['request-over-time'], () => fetchTotalRequestOvertime());

  return data;
}