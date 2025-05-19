import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { dataTableParamsBuilder } from "src/utils/data-table-params-builder";
import type { WithPagination } from "src/utils/types";
import { usePaginationQuery } from "src/utils/hooks/use-pagination-query";

  export function fetchTitleList(params: Partial<any>, company_id?: string) {
    const baseUrl = window.location.origin;
    const endpointUrl = new URL('/titles?is_active=all', baseUrl);
  
    if (company_id && params.is_super_admin === false) {
      endpointUrl.searchParams.append('company_id', company_id);
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
  
  export function useTitleCompanyList(params: Partial<any>, company_id?: string) {
    return usePaginationQuery(['title-list', params.search, company_id], (paginationState) =>
      fetchTitleList({ ...params, ...paginationState }, company_id)
    );
  }
  