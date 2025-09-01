import { useQuery } from '@tanstack/react-query';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http'
import type { WithPagination } from 'src/utils/types';
import type { TotalTaskByStatus, TotalTaskCompleted } from './types';

// Total Task by Status
async function fetchTotalTaskByStatus(internalCompanyId: number) {
  const { data } = await http<{ data: {status: TotalTaskByStatus[] }}>(`personal-load/total-task-by-status/${internalCompanyId}`);

  return data;
}

export function useTotalTaskByStatus(internalCompanyId: number) {
  const data = useQuery(['total-task-by-status'], () => fetchTotalTaskByStatus(internalCompanyId));

  return data;
}


// Total Task Completed
async function fetchTotalTaskCompleted(internalCompanyId: number) {
    const { data } = await http<{ data: TotalTaskCompleted[] }>(`personal-load/total-tasks-completed/${internalCompanyId}`);
  
    return data;
  }
  
  export function useTotalTaskCompleted(internalCompanyId: number) {
    const data = useQuery(['total-tasks-completed'], () => fetchTotalTaskCompleted(internalCompanyId));
  
    return data;
  }


// Unresolved CITO
export function fetchIncompleteTask(params: Partial<any>, internalCompanyId: number) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL(`/personal-load/incomplete-task/${internalCompanyId}`, baseUrl);


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

export function useIncompleteTask(params: Partial<any> , internalCompanyId: number) {
  return usePaginationQuery(
    ['incomplete-task', params.keyword, params.from, params.to, internalCompanyId],
    (paginationState) => fetchIncompleteTask({ ...params, ...paginationState }, internalCompanyId)
  );
}
