import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';

import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';

import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { WithPagination } from 'src/utils/types';
import { Products } from '../types';

export function useProductByCompanyId(
  companyId: number,
  isClientCompany?: boolean,
  onSuccess?: () => void,
  internalCompanyId?: number
) {
  return useQuery(
    ['product-items', companyId],
    async () => {
      const { data: response } = await http<{ data: Products[] }>(
        isClientCompany
          ? `products?client_company_id=${companyId}${internalCompanyId ? `&company_id=${internalCompanyId}` : ''}`
          : `products?company_id=${companyId}${internalCompanyId ? `&company_id=${internalCompanyId}` : ''}`
      );

      return response;
    },
    {
      onSuccess: () => {
        console.log('onsuc');
        onSuccess?.();
      },
      enabled: companyId !== null || companyId !== 0,
    }
  );
}

export function fetchProductList(params: Partial<any>, company_id?: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/products', baseUrl);

  if (company_id) {
    endpointUrl.searchParams.append('company_id', company_id);
  }

  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,

    ...params,
  });

  return http<WithPagination<any>>(endpointUrl.toString().replace(baseUrl, ''));
}

export function useProductCompanyList(params: Partial<any>, company_id?: string) {
  return usePaginationQuery(['product-list', params.keyword], (paginationState) =>
    fetchProductList({ ...params, ...paginationState }, company_id)
  );
}
