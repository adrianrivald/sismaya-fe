
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bounce, toast } from 'react-toastify';
import { dataTableParamsBuilder } from 'src/utils/data-table-params-builder';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http';
import { WithPagination } from 'src/utils/types';


async function fetchProductFilter(params: any) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/product-use', baseUrl);

  if(params.internal_company_id){
    endpointUrl.searchParams.append('internal_company_id', params.internal_company_id);
  }

  if (params.company_id) {
    endpointUrl.searchParams.append('company_id', params.company_id);
  }

  const { data } = await http<{data: any}>(
    endpointUrl.toString().replace(baseUrl, '')
  )

  return data
  }

  export function useProductFilter(params: any) {
    const data = useQuery(
      ['product-filter'],
      () => fetchProductFilter(params)
    );
  
    return data;
  }



export type StoreProduct = {
  product_id:number;
  company_id?: number
};

export function useAddProductFilter() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: StoreProduct) => {
        const { product_id, company_id } = formData;
  
  
        return http(`product-use`, {
          data: {
            product_id,
            company_id
          },
        });
      },
      {
          onSuccess: (res: any) => {
          const companyId = res?.data?.company_id
          queryClient.invalidateQueries({queryKey: ['product-filter', companyId]});
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
        },
        onError: (error) => {
          const reason =
            error instanceof Error ? error.message : 'Something went wrong';
  
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


async function deleteProductFilterById(productFilterId: number) {
  await http(`product-use/${productFilterId}`, {
    method: 'DELETE',
  });
}

export function useDeleteProductFilterById() {
  const queryClient = useQueryClient();


  return useMutation(
    (productFilterId: number) => deleteProductFilterById(productFilterId),
    {
      onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ["product-filter"]})
          toast.success("Item deleted successfully", {
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
        const reason =
          error instanceof Error ? error.message : 'Something went wrong';

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
