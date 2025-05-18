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

  if (params.search) {
    endpointUrl.searchParams.append('search', params.search);
  }

  endpointUrl.searchParams.append('is_active', params.is_active || 'all');

  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,
    ...params,
  });

  return http<WithPagination<any>>(endpointUrl.toString().replace(baseUrl, ''));
}

export function useProductCompanyList(params: Partial<any>, company_id?: string) {
  return usePaginationQuery(['product-list', params.search, company_id], (paginationState) =>
    fetchProductList({ ...params, ...paginationState }, company_id)
  );
}

export function useProductCompany(company_id?: string, page_size?: number, search?: string) {
  return useQuery(
    ['product-list', company_id, page_size, search],
    async () => {
      const baseUrl = window.location.origin;
      const endpointUrl = new URL('/products', baseUrl);

      if (company_id) {
        endpointUrl.searchParams.append('company_id', company_id);
      }

      if (page_size) {
        endpointUrl.searchParams.append('page_size', String(page_size));
      }

      if (search) {
        endpointUrl.searchParams.append('search', search);
      }

      const { data: response } = await http<{ data: Products[] }>(
        endpointUrl.toString().replace(baseUrl, '')
      );

      return response;
    },
    {
      enabled: !!company_id,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
}
