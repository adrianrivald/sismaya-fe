
import { PaginationState } from '@tanstack/react-table';
import { useLocation } from 'react-router-dom';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http, RequestInitClient } from 'src/utils/http';
import { WithPagination } from 'src/utils/types';


export function fetchProductUse(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/product-use/fetch', baseUrl);

  if (params.internalCompanyId) {
    endpointUrl.searchParams.append('internal_company_id', params.internalCompanyId);
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

export function useProductUse(params: Partial<any>) {
  return usePaginationQuery(
    ['product-use', params.keyword, params.internalCompanyId],
    (paginationState) => fetchProductUse({ ...params, ...paginationState })
  );
}
