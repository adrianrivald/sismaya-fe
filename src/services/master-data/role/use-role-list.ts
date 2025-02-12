import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import type { WithPagination } from 'src/utils/types';
import { Role } from "./types";

export function useRole() {
  return useQuery(['role'], async () => {
    const { data: response } = await http<{ data: Role[] }>(
      'roles'
    );

    return response;
  });
}

function fetchRoleList(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/roles', baseUrl);

  if (params.type) {
    endpointUrl.searchParams.append('type', params.type);
  }

  if (params.internal_company){
    endpointUrl.searchParams.append('internal_company', params.internal_company);
  }
  
  if (params.role_id){
    endpointUrl.searchParams.append('role_id', params.role_id);
  }

  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,
    filterValues: [params.order],
    ...params,
  });

  return http<WithPagination<any>>(endpointUrl.toString().replace(baseUrl, ''));
}

export function useRoleList(params: Partial<any>) {
  return usePaginationQuery(['roles', params.type, params.keyword, params.internal_company, params.role_id], (paginationState) =>
    fetchRoleList({ ...params, ...paginationState })
  );
}
