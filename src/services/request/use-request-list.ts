
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http';
import { WithPagination } from 'src/utils/types';


export function fetchRequestList(params: Partial<any>, assignee_company_id: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/requests', baseUrl);

  if (assignee_company_id) {
    endpointUrl.searchParams.append('assignee_company_id', assignee_company_id);
  }

  if (params.active) {
    endpointUrl.searchParams.append('active', params.active);
  }

  if (params.platform) {
    endpointUrl.searchParams.append('platform', params.platform);
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

export function useRequestList(params: Partial<any>, assignee_company_id: string
  ) {
  return usePaginationQuery(
    ['request', params.keyword, params.active, params.order, params.platform, assignee_company_id],
    (paginationState) => fetchRequestList({ ...params, ...paginationState }, assignee_company_id)
  );
}
