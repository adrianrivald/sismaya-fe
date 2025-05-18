import { useQuery } from '@tanstack/react-query';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http';
import { WithPagination } from 'src/utils/types';

export function fetchFaqList(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/faq', baseUrl);
  if (params.product_id !== null) {
    endpointUrl.searchParams.append('product_id', params.product_id);
  }

  if (params.search) {
    endpointUrl.searchParams.append('search', params.search);
  }

  if (params.company_id) {
    endpointUrl.searchParams.append('company_id', params.company_id);
  }

  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,
    ...params,
  });

  return http<WithPagination<any>>(endpointUrl.toString().replace(baseUrl, ''));
}

export function useFaqList(params: Partial<any>, company_id?: string) {
  return usePaginationQuery(['faq-list', params.search, company_id], (paginationState) =>
    fetchFaqList({ ...params, ...paginationState })
  );
}

async function fetchProductFaq(params: any, company_id: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL(`/company-faq/${company_id}`, baseUrl);

  if (params.search) {
    endpointUrl.searchParams.append('search', params.search);
  }

  endpointUrl.searchParams.append('page_size', '99999');

  const { data } = await http<{
    data: {
      faq: { question: string; answer: string; is_active: boolean; sort: number; id: number }[];
      product_name: string;
    }[];
  }>(endpointUrl.toString().replace(baseUrl, ''));

  return data;
}

export function useProductFAQ(params: any, company_id: string) {
  const data = useQuery(['product-faq', params, company_id], () =>
    fetchProductFaq(params, company_id)
  );

  return data;
}

export async function fetchFaqListByCompanyProduct(params: any, product_id: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL(`/faq/${product_id}/product`, baseUrl);

  if (params.search) {
    endpointUrl.searchParams.append('search', params.search);
  }

  if (params.company_id) {
    endpointUrl.searchParams.append('company_id', params.company_id);
  }

  endpointUrl.searchParams.append('page_size', '99999');

  const { data } = await http<{
    data: {
      answer: string;
      question: string;
      is_active: boolean;
      id: number;
    }[];
  }>(endpointUrl.toString().replace(baseUrl, ''));

  return data;
}

export function useProductFAQList(params: any, product_id: string) {
  const data = useQuery(['product-faq-list', params, product_id], () =>
    fetchFaqListByCompanyProduct(params, product_id)
  );

  return data;
}
