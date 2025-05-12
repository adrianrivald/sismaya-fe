import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { dataTableParamsBuilder } from "src/utils/data-table-params-builder";
import type { WithPagination } from "src/utils/types";
import { usePaginationQuery } from "src/utils/hooks/use-pagination-query";
import type {  Statuses } from "../types";

export function useStatusByCompanyId(companyId: number) {
    return useQuery(['status-items', companyId], async () => {
      const { data: response } = await http<{ data: Statuses[] }>(
        `progress-status?company_id=${companyId}`
      );
  
      return response;
    });
  }

  
    export function fetchStatusList(params: Partial<any>, company_id?: string) {
      const baseUrl = window.location.origin;
      const endpointUrl = new URL('/progress-status', baseUrl);
    
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
    
    export function useStatusCompanyList(params: Partial<any>, company_id?: string) {
      return usePaginationQuery(['status-list', params.search, company_id], (paginationState) =>
        fetchStatusList({ ...params, ...paginationState }, company_id)
      );
    }
    