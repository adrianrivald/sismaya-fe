import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http';
import { WithPagination } from 'src/utils/types';

export function fetchSettingCitoList(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/citos', baseUrl);

  if (params.search) {
    endpointUrl.searchParams.append('search', params.search);
  }

  if (params.company_id) {
    endpointUrl.searchParams.append('cito_type', params.cito_type);
  }

  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,
    ...params,
  });

  return http<WithPagination<any>>(endpointUrl.toString().replace(baseUrl, ''));
}

export function useSettingCitoList(params: Partial<any>) {
  return usePaginationQuery(['faq-list', params.search, params.cito_type], (paginationState) =>
    fetchSettingCitoList({ ...params, ...paginationState })
  );
}
