import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http';
import type { WithPagination } from 'src/utils/types';

export function fetchRequestList(params: Partial<any>, assignee_company_id: number) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/requests', baseUrl);

  if (assignee_company_id) {
    endpointUrl.searchParams.append('assignee_company_id', assignee_company_id.toString());
  }

  if (params.status) {
    endpointUrl.searchParams.append('status', params.status);
  }

  if (params.cito) {
    endpointUrl.searchParams.append('cito', params.cito);
  }

  if (params.step) {
    endpointUrl.searchParams.append('step', params.step);
  }

  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,
    filterValues: [params.order],
    ...params,
  });

  return http<WithPagination<any>>(endpointUrl.toString().replace(baseUrl, ''));
}

export function useRequestList(params: Partial<any>, assignee_company_id: number) {
  return usePaginationQuery(
    ['request', params.keyword, params.status, params.cito, params.step, assignee_company_id],
    (paginationState) => fetchRequestList({ ...params, ...paginationState }, assignee_company_id)
  );
}
