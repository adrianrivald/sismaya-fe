import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http';
import type { WithPagination } from 'src/utils/types';

function fetchUserList(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/users', baseUrl);

  if (params.type) {
    endpointUrl.searchParams.append('type', params.type);
  }

  if (params.internal_company){
    endpointUrl.searchParams.append('internal_company', params.internal_company);
  }
  
  if (params.internalCompanies){
    endpointUrl.searchParams.append('internal_company', params.internalCompanies);
  }
  
  
  if (params.role_id){
    endpointUrl.searchParams.append('role_id', params.role_id);
  }

  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,
    filterValues: [params.order],
    ...params,
  });

  return http<WithPagination<any>>(endpointUrl.toString().replace(baseUrl, ''));
}

export function useUserList(params: Partial<any>) {
  return usePaginationQuery(['user', params.type, params.keyword, params.internal_company, params.role_id, params.internalCompanies], (paginationState) =>
    fetchUserList({ ...params, ...paginationState })
  );
}
