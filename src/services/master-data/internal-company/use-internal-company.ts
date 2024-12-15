
import { PaginationState } from '@tanstack/react-table';
import { useLocation } from 'react-router-dom';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http, RequestInitClient } from 'src/utils/http';
import { WithPagination } from 'src/utils/types';


function fetchInternalCompanyList(params: Partial<any>, isEnglish: boolean) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/companies', baseUrl);

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

export function useInternalCompanyList(params: Partial<any>, isEnglish: boolean) {
  return usePaginationQuery(
    ['internal-company', params.keyword, params.active, params.order, params.platform, isEnglish],
    (paginationState) => fetchInternalCompanyList({ ...params, ...paginationState }, isEnglish)
  );
}
