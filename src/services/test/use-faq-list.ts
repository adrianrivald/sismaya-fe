
import { PaginationState } from '@tanstack/react-table';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http';
import { WithPagination } from 'src/utils/types';


function fetchFaqList(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/cms/blog/faq', baseUrl);

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

export function useFaqList(params: Partial<any> = {}) {
  return usePaginationQuery(
    ['blog-faq', params.keyword, params.active, params.order, params.platform],
    (paginationState) => fetchFaqList({ ...params, ...paginationState })
  );
}
