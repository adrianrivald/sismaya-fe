import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http';
import { WithPagination } from 'src/utils/types';

export function fetchFaqList(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/faq', baseUrl);

  if (params.product_id) {
    endpointUrl.searchParams.append('product_id', params.product_id);
  }

  if (params.search) {
    endpointUrl.searchParams.append('search', params.search);
  }

  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,
    ...params,
  });

  return http<WithPagination<any>>(endpointUrl.toString().replace(baseUrl, ''));
}

export function useFaqList(params: Partial<any>) {
  return usePaginationQuery(['faq-list', params.search], (paginationState) =>
    fetchFaqList({ ...params, ...paginationState })
  );
}
