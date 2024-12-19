
import { PaginationState } from '@tanstack/react-table';
import { useLocation } from 'react-router-dom';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http, RequestInitClient } from 'src/utils/http';
import { WithPagination } from 'src/utils/types';


function fetchUserList(params: Partial<any> ) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/users', baseUrl);

  if (params.type) {
    endpointUrl.searchParams.append('type', params.type);

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

export function useUserList(params: Partial<any>) {
  return usePaginationQuery(
    ['user', params.keyword, params.active, params.order, params.platform],
    (paginationState) => fetchUserList({ ...params, ...paginationState })
  );
}
