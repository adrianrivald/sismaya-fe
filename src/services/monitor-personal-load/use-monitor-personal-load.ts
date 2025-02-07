import { useQuery } from '@tanstack/react-query';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http'
import type { WithPagination } from 'src/utils/types';
import type { TotalTaskByStatus, TotalTaskCompleted } from './types';

// Total Task by Status
async function fetchTotalTaskByStatus() {
  const { data } = await http<{ data: {status: TotalTaskByStatus[] }}>(`personal-load/total-task-by-status`);

  return data;
}

export function useTotalTaskByStatus() {
  const data = useQuery(['total-task-by-status'], () => fetchTotalTaskByStatus());

  return data;
}


// Total Task Completed
async function fetchTotalTaskCompleted() {
    const { data } = await http<{ data: TotalTaskCompleted[] }>(`personal-load/total-tasks-completed`);
  
    return data;
  }
  
  export function useTotalTaskCompleted() {
    const data = useQuery(['total-tasks-completed'], () => fetchTotalTaskCompleted());
  
    return data;
  }


// Unresolved CITO
export function fetchIncompleteTask(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/personal-load/incomplete-task', baseUrl);


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

export function useIncompleteTask(params: Partial<any> ) {
  return usePaginationQuery(
    ['incomplete-task', params.keyword, params.from, params.to],
    (paginationState) => fetchIncompleteTask({ ...params, ...paginationState })
  );
}
