import { useQuery } from '@tanstack/react-query';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http'
import type { WithPagination } from 'src/utils/types';
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

  export function fetchUnresolvedCitoInternal(params: Partial<any>) {
    const baseUrl = window.location.origin;
    const endpointUrl = new URL(`/dashboard-internal/unresolved-cito/${params.internalCompanyId}`, baseUrl);
  
  
    if (params.from) {
      endpointUrl.searchParams.append('from', params.from);
    }
    if (params.to) {
      endpointUrl.searchParams.append('to', params.to);
    }
  
    dataTableParamsBuilder({
      searchParams: endpointUrl.searchParams,
      filterValues: [params.order],
      ...params,
    });
  
  
    return http<WithPagination<any>>(
      endpointUrl.toString().replace(baseUrl, '')
    );
  }
  
  export function useUnresolvedCitoInternal(params: Partial<any> ) {
    return usePaginationQuery(
      ['unresolved-cito-internal', params.internalCompanyId, params.from, params.to],
      (paginationState) => fetchUnresolvedCitoInternal({ ...params, ...paginationState })
    );
  }
  

// Total Request Overtime

async function fetchTotalRequestOvertimeInternal(internalCompanyId: number, dateFrom: string, dateTo: string) {
  const { data } = await http<{ data: RequestOvertime[] }>(`dashboard-internal/total-request-over-time/${internalCompanyId}?from=${dateFrom}&to=${dateTo}`);

  return data;
}

export function useTotalRequestOvertimeInternal(internalCompanyId: number, dateFrom: string, dateTo: string) {
  const data = useQuery(['request-over-time', dateFrom], () => fetchTotalRequestOvertimeInternal(internalCompanyId, dateFrom, dateTo));

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

// Top Staff Hour
async function fetchInternalTopStaffbyHour(internalCompanyId: number,  dateFrom: string, dateTo: string) {
  const { data } = await http<{ data: TopStaff[] }>(`dashboard-internal/top-staff-hour/${internalCompanyId}?from=${dateFrom}&to=${dateTo}`);

  return data;
}

export function useInternalTopStaffbyHour(internalCompanyId: number, dateFrom: string, dateTo: string) {
  const data = useQuery(['internal-top-staff-hour', internalCompanyId, dateFrom], () => fetchInternalTopStaffbyHour(internalCompanyId, dateFrom, dateTo));

  return data;
}

// Request Handling Time
async function fetchRequestHandlingTime(internalCompanyId: number, dateFrom: string, dateTo: string) {
  const { data } = await http<{ data: any }>(`dashboard-internal/request-handling-time/${internalCompanyId}?from=${dateFrom}&to=${dateTo}`);

  return data;
}

export function useRequestHandlingTime(internalCompanyId: number, dateFrom: string, dateTo: string) {
  const data = useQuery(['internal-request-handling-time', internalCompanyId], () => fetchRequestHandlingTime(internalCompanyId, dateFrom, dateTo));

  return data;
}

// Happiness Rating
async function fetchHappinessRating(internalCompanyId: number, dateFrom: string, dateTo: string) {
  const { data } = await http<{ data: any }>(`dashboard-internal/rating-summary/${internalCompanyId}`);

  return data;
}

export function useHappinessRating(internalCompanyId: number, dateFrom: string, dateTo: string) {
  const data = useQuery(['happiness-rating', internalCompanyId], () => fetchHappinessRating(internalCompanyId, dateFrom, dateTo));

  return data;
}


export function fetchRequestFeedbacks(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL(`/dashboard-internal/feedbacks/${params.internalCompanyId}`, baseUrl);


  if (params.from) {
    endpointUrl.searchParams.append('from', params.from);
  }
  if (params.to) {
    endpointUrl.searchParams.append('to', params.to);
  }

  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,
    filterValues: [params.order],
    ...params,
  });


  return http<WithPagination<any>>(
    endpointUrl.toString().replace(baseUrl, '')
  );
}

export function useRequestFeedbacks(params: Partial<any> ) {
  return usePaginationQuery(
    ['request-feedbacks', params.internalCompanyId, params.from, params.to],
    (paginationState) => fetchRequestFeedbacks({ ...params, ...paginationState })
  );
}

async function fetchRequestFeedbacksAll(internalId?: number) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL(`/dashboard-internal/feedbacks/${internalId}`, baseUrl);


  const data  = await http(
    endpointUrl.toString().replace(baseUrl, '')
  )

  return data
  }

  export function useRequestFeedbacksAll(internalId?: number) {
    const data = useQuery(
      ['request-feedbacks-all'],
      () => fetchRequestFeedbacksAll(internalId)
    );
  
    return data;
  }
