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
  internalCompanyId?: number,
  showAll?: boolean
) {
  return useQuery(
    ['product-items', companyId, showAll],
    async () => {
      const params = new URLSearchParams();

      if (isClientCompany) {
        params.append('client_company_id', String(companyId));
        if (internalCompanyId) {
          params.append('company_id', String(internalCompanyId));
        }
      } else {
        params.append('company_id', String(companyId));
      }

      if (showAll) {
        params.append('page_size', '10000');
      }

      const { data: response } = await http<{ data: Products[] }>(
        `products?${params.toString()}`
      );

      return response;
    },
    {
      onSuccess: () => {
        console.log('onsuc');
        onSuccess?.();
      },
      enabled: companyId !== null && companyId !== 0,
    }
  );
}


export function fetchProductList(params: Partial<any>, company_id?: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/products', baseUrl);

  if (company_id && params.is_super_admin === false) {
    endpointUrl.searchParams.append('company_id', company_id);
  }

  if (params.name) {
    endpointUrl.searchParams.append('name_sort', params.name);
  }

  if (params.company_id) {
    endpointUrl.searchParams.append('company_id', params.company_id);
  }

  if (params.search) {
    endpointUrl.searchParams.append('search', params.search);
  }

  if (params.is_active) {
    endpointUrl.searchParams.append('is_active', params.is_active || 'all');
  }

  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,
    ...params,
  });

  return http<WithPagination<any>>(endpointUrl.toString().replace(baseUrl, ''));
}

export function useProductCompanyList(params: Partial<any>, company_id?: string) {
  return usePaginationQuery(
    ['product-list', params.search, params.company_id, params.is_active, params.name, company_id],
    (paginationState) => fetchProductList({ ...params, ...paginationState }, company_id)
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

export function useProductCompanyWithGeneral(
  company_id?: string,
  page_size?: number,
  search?: string
) {
  return useQuery(
    ['product-list-general', company_id, page_size, search],
    async () => {
      const baseUrl = window.location.origin;
      const endpointUrl = new URL('/products-with-general', baseUrl);

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
