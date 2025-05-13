import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { dataTableParamsBuilder } from "src/utils/data-table-params-builder";
import type { WithPagination } from "src/utils/types";
import { usePaginationQuery } from "src/utils/hooks/use-pagination-query";
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


  export function fetchDivisionList(params: Partial<any>, company_id?: string) {
    const baseUrl = window.location.origin;
    const endpointUrl = new URL('/departments?is_active=all', baseUrl);
  
    if (company_id) {
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
  
  export function useDivisionCompanyList(params: Partial<any>, company_id?: string) {
    return usePaginationQuery(['division-list', params.search, company_id], (paginationState) =>
      fetchDivisionList({ ...params, ...paginationState }, company_id)
    );
  }