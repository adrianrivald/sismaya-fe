
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http';
import { WithPagination } from 'src/utils/types';


export function fetchCompanyRelation(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/company-relation', baseUrl);

  if (params.search) {
    endpointUrl.searchParams.append('search', params.search);
  }

  if (params.internal_company_id) {
    endpointUrl.searchParams.append('internal_company_id', params.internal_company_id);
  }

  if (params.client_company_id) {
    endpointUrl.searchParams.append('client_company_id', params.client_company_id);
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

export function useCompanyRelation(params: Partial<any>) {
  return usePaginationQuery(
    ['company-relation', params.search, params.internal_company_id, params.client_company_id],
    (paginationState) => fetchCompanyRelation({ ...params, ...paginationState })
  );
}
