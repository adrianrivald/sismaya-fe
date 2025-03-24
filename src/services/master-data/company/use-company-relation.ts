import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http';
import { WithPagination } from 'src/utils/types';

export function fetchCompanyRelation(params: Partial<any>) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/company-relation', baseUrl);

  if (params.search) {
    endpointUrl.searchParams.append('search', params.search);
  }

  if (params.internal_company_id) {
    endpointUrl.searchParams.append('internal_company_id', params.internal_company_id);
  }

  if (params.client_company_id) {
    endpointUrl.searchParams.append('client_company_id', params.client_company_id);
  }

  dataTableParamsBuilder({
    searchParams: endpointUrl.searchParams,
    filterValues: [params.order],
    ...params,
  });

  return http<WithPagination<any>>(endpointUrl.toString().replace(baseUrl, ''));
}

export function useCompanyRelation(params: Partial<any>) {
  return usePaginationQuery(
    ['company-relation', params.search, params.internal_company_id, params.client_company_id],
    (paginationState) => fetchCompanyRelation({ ...params, ...paginationState })
  );
}

export type StoreCompanyRelation = {
  internal_company_id: number;
  client_company_id?: number;
  id_relation?: number;
};

export function useAddCompanyRelation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  return useMutation(
    async (formData: StoreCompanyRelation) => {
      const { internal_company_id, client_company_id } = formData;

      return http(`company-relation`, {
        data: {
          client_company_id,
          internal_company_id,
        },
      });
    },
    {
      onSuccess: (res: any) => {
        const url = location.pathname.replace(/\/create$/, '');
        queryClient.invalidateQueries({ queryKey: ['company-relation'] });
        toast.success('Data added successfully', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        });
        navigate(url);
      },
      onError: (error) => {
        const reason = error instanceof Error ? error.message : 'Something went wrong';

        toast.error(reason, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        });
      },
    }
  );
}

export function useUpdateCompanyRelation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  return useMutation(
    async (formData: StoreCompanyRelation) => {
      const { internal_company_id, client_company_id, id_relation } = formData;

      return http(`company-relation/${id_relation}`, {
        method: 'PUT',
        data: {
          client_company_id,
          internal_company_id,
        },
      });
    },
    {
      onSuccess: (res: any) => {
        // const url = location.pathname.replace(/\/create$/, '');
        queryClient.invalidateQueries({ queryKey: ['company-relation'] });
        toast.success('Data added successfully', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        });
        // navigate(url);
      },
      onError: (error) => {
        const reason = error instanceof Error ? error.message : 'Something went wrong';

        toast.error(reason, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        });
      },
    }
  );
}

async function deleteCompanyRelation(companyRelationId: number) {
  await http(`company-relation/${companyRelationId}`, {
    method: 'DELETE',
  });
}

export function useDeleteCompanyRelation() {
  const queryClient = useQueryClient();

  return useMutation((companyRelationId: number) => deleteCompanyRelation(companyRelationId), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-relation'] });
      toast.success('Item deleted successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    },
    onError: (error) => {
      const reason = error instanceof Error ? error.message : 'Something went wrong';

      toast.error(reason, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    },
  });
}
