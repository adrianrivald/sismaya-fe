
import { PaginationState } from '@tanstack/react-table';
import { useLocation } from 'react-router-dom';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http, RequestInitClient } from 'src/utils/http';
import { WithPagination } from 'src/utils/types';


function fetchCoinList(params: Partial<any>, isEnglish: boolean) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/cms/packages', baseUrl);

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

export function useCoinList(params: Partial<any>, isEnglish: boolean) {
  return usePaginationQuery(
    ['coin', params.keyword, params.active, params.order, params.platform, isEnglish],
    (paginationState) => fetchCoinList({ ...params, ...paginationState }, isEnglish)
  );
}
