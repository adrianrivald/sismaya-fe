import { useQuery } from '@tanstack/react-query';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http'
import { WithPagination } from 'src/utils/types';
import type { ClientTotalRequest, ClientTotalRequestByState, PendingRequest, RequestDue, RequestOvertime, TopRequester, TopStaff } from '../types';

// Total Request
async function fetchInternalTotalRequestByCompany(internalCompanyId: number,  dateFrom: string, dateTo: string) {
  const { data } = await http<{ data: ClientTotalRequest }>(`dashboard-internal/total-request/${internalCompanyId}?from=${dateFrom}&to=${dateTo}`);

  return data;
}

export function useInternalTotalRequestByCompany(internalCompanyId: number, dateFrom: string, dateTo: string) {
  const data = useQuery(['internal-total-request', internalCompanyId, dateFrom], () => fetchInternalTotalRequestByCompany(internalCompanyId, dateFrom, dateTo));

  return data;
}


// Total Request By State
async function fetchTotalRequestByStateInternal(internalCompanyId: number, dateFrom: string, dateTo: string) {
    const { data } = await http<{ data: ClientTotalRequestByState }>(`dashboard-internal/total-request-by-state/${internalCompanyId}?from=${dateFrom}&to=${dateTo}`);
  
    return data;
  }
  
  export function useInternalTotalRequestByState(internalCompanyId: number, dateFrom: string, dateTo: string) {
    const data = useQuery(['internal-total-request-by-state', internalCompanyId, dateFrom], () => fetchTotalRequestByStateInternal(internalCompanyId, dateFrom, dateTo));
  
    return data;
  }

// Request Pending

async function fetchPendingRequestInternal(internalCompanyId: number,) {
    const { data } = await http<{ data: PendingRequest }>(`dashboard-internal/request-pending/${internalCompanyId}`);
  
    return data;
  }
  
  export function usePendingRequestInternal(internalCompanyId: number,) {
    const data = useQuery(['internal-pending-request'], () => fetchPendingRequestInternal(internalCompanyId));
  
    return data;
  }

  // Unresolved CITO


export function fetchUnresolvedCitoInternal(params: Partial<any>, internalCompanyId: number,) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL(`/dashboard-internal/unresolved-cito/${internalCompanyId}`, baseUrl);

  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,
    filterValues: [params.order],
    ...params,
  });


  return http<WithPagination<any>>(
    endpointUrl.toString().replace(baseUrl, '')
  );
}

export function useUnresolvedCitoInternal(params: Partial<any>, internalCompanyId: number ) {
  return usePaginationQuery(
    ['unresolved-cito', params.keyword],
    (paginationState) => fetchUnresolvedCitoInternal({ ...params, ...paginationState }, internalCompanyId)
  );
}
  

// Total Request Overtime

async function fetchTotalRequestOvertimeInternal(internalCompanyId: number,) {
  const { data } = await http<{ data: RequestOvertime[] }>(`dashboard-internal/total-request-over-time/${internalCompanyId}`);

  return data;
}

export function useTotalRequestOvertimeInternal(internalCompanyId: number) {
  const data = useQuery(['request-over-time'], () => fetchTotalRequestOvertimeInternal(internalCompanyId));

  return data;
}


// Request Due
async function fetchRequestDueInternal(internalCompanyId: number, requestDueDate: string) {
  const { data } = await http<{ data: RequestDue }>(`dashboard-internal/request-due/${internalCompanyId}?due=${requestDueDate}`);

  return data;
}

export function useRequestDueInternal(internalCompanyId: number, requestDueDate: string) {
  const data = useQuery(['request-due', requestDueDate], () => fetchRequestDueInternal(internalCompanyId, requestDueDate));

  return data;
}

// Request Delivery Rate
async function fetchRequestDeliveryRateInternal(internalCompanyId: number,) {
  const { data } = await http<{ data: any }>(`dashboard-internal/request-delivery-rate/${internalCompanyId}`);

  return data;
}

export function useRequestDeliveryRateInternal(internalCompanyId: number,) {
  const data = useQuery(['request-delivery-rate'], () => fetchRequestDeliveryRateInternal(internalCompanyId));

  return data;
}


// Top Requester
async function fetchInternalTopRequester(internalCompanyId: number,  dateFrom: string, dateTo: string) {
  const { data } = await http<{ data: TopRequester[] }>(`dashboard-internal/top-requester/${internalCompanyId}?from=${dateFrom}&to=${dateTo}`);

  return data;
}

export function useInternalTopRequester(internalCompanyId: number, dateFrom: string, dateTo: string) {
  const data = useQuery(['internal-top-requester', internalCompanyId, dateFrom], () => fetchInternalTopRequester(internalCompanyId, dateFrom, dateTo));

  return data;
}


// Top Staff
async function fetchInternalTopStaff(internalCompanyId: number,  dateFrom: string, dateTo: string) {
  const { data } = await http<{ data: TopStaff[] }>(`dashboard-internal/top-staff/${internalCompanyId}?from=${dateFrom}&to=${dateTo}`);

  return data;
}

export function useInternalTopStaff(internalCompanyId: number, dateFrom: string, dateTo: string) {
  const data = useQuery(['internal-top-staff', internalCompanyId, dateFrom], () => fetchInternalTopStaff(internalCompanyId, dateFrom, dateTo));

  return data;
}