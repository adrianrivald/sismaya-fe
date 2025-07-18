import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { dataTableParamsBuilder } from "src/utils/data-table-params-builder";
import type { WithPagination } from "src/utils/types";
import { usePaginationQuery } from "src/utils/hooks/use-pagination-query";
import type { Categories } from "../types";

export function useCategoryByCompanyId(companyId: number) {
    return useQuery(['category-items', companyId], async () => {
      const { data: response } = await http<{ data: Categories[] }>(
        `categories?company_id=${companyId}`
      );
  
      return response;
    });
  }

  
  export function fetchCategoryList(params: Partial<any>, company_id?: string) {
    const baseUrl = window.location.origin;
    const endpointUrl = new URL('/categories', baseUrl);
  
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
  
  export function useCategoryCompanyList(params: Partial<any>, company_id?: string) {
    return usePaginationQuery(['category-list', params.search, params.company_id, params.is_active,params.name,  company_id], (paginationState) =>
      fetchCategoryList({ ...params, ...paginationState }, company_id)
    );
  }
  