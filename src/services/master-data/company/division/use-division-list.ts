import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { dataTableParamsBuilder } from "src/utils/data-table-params-builder";
import type { WithPagination } from "src/utils/types";
import { usePaginationQuery } from "src/utils/hooks/use-pagination-query";
import { useLocation } from "react-router-dom";
import type { Department } from "../types";

export async function fetchDivisionByCompanyId(companyId: number) {
  const { data } = await http<{ data: Department[] }>(`departments?company_id=${companyId}`);

  return data;
}

export function useDivisionByCompanyId(companyId: number) {
  const data = useQuery(
    ['division-items', companyId],
    () => fetchDivisionByCompanyId(companyId ?? ''),
    {
      enabled: companyId !== undefined,
    }
  );

  return data;
}


  export function fetchDivisionList(params: Partial<any>, company_id?: string, company_type?: string) {
    const baseUrl = window.location.origin;
    const endpointUrl = new URL('/departments', baseUrl);
  
    if (company_id && params.is_super_admin === false) {
      endpointUrl.searchParams.append('company_id', company_id);
    }
    
    if (company_type && params.is_super_admin === true) {
      endpointUrl.searchParams.append('company_type', company_type);
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
    
    if (params.is_active){
      endpointUrl.searchParams.append('is_active', params.is_active || 'all');
    }
    
    dataTableParamsBuilder({
      searchParams: endpointUrl.searchParams,
      ...params,
    });
  
    return http<WithPagination<any>>(endpointUrl.toString().replace(baseUrl, ''));
  }
  
  export function useDivisionCompanyList(params: Partial<any>, company_id?: string, company_type?: string) {
    const location = useLocation();
    return usePaginationQuery(['division-list',location, params.search, params.company_id, params.is_active, params.name, company_id], (paginationState) =>
      fetchDivisionList({ ...params, ...paginationState }, company_id, company_type)
    );
  }