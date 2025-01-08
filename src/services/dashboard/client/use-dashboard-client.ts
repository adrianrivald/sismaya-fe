import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http'
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

async function fetchPendingRequest() {
    const { data } = await http<{ data: PendingRequest }>(`dashboard-client/request-pending`);
  
    return data;
  }
  
  export function usePendingRequest() {
    const data = useQuery(['client-pending-request'], () => fetchPendingRequest());
  
    return data;
  }
  
