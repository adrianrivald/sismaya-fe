
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http';
import { WithPagination } from 'src/utils/types';


export function fetchProductFilter(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/product-use', baseUrl);

  if (params.company_id) {
    endpointUrl.searchParams.append('company_id', params.company_id);
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

export function useProductFilter(params: Partial<any>) {
  return usePaginationQuery(
    ['product-filter', params.company_id],
    (paginationState) => fetchProductFilter({ ...params, ...paginationState })
  );
}
