import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { dataTableParamsBuilder } from "src/utils/data-table-params-builder";
import type { WithPagination } from "src/utils/types";
import { usePaginationQuery } from "src/utils/hooks/use-pagination-query";

  export function fetchTitleList(params: Partial<any>, company_id?: string) {
    const baseUrl = window.location.origin;
    const endpointUrl = new URL('/titles', baseUrl);
  
    if (company_id && params.is_super_admin === false) {
      endpointUrl.searchParams.append('company_id', company_id);
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
  
  export function useTitleCompanyList(params: Partial<any>, company_id?: string) {
    return usePaginationQuery(['title-list', params.search, params.company_id, params.is_active, company_id], (paginationState) =>
      fetchTitleList({ ...params, ...paginationState }, company_id)
    );
  }
  