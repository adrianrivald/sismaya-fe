import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bounce, toast } from 'react-toastify';
import { http } from 'src/utils/http';
import { Products } from '../types';

async function deleteProductItem(productId: number) {
  await http<{ data: Products }>(`products/${productId}`, {
    method: 'DELETE',
  });
}

export function useDeleteProductItem(companyId: number) {
  const queryClient = useQueryClient();

  return useMutation((productId: number) => deleteProductItem(productId), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-items', companyId] });
      toast.success('Success delete item', {
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

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation((companyId: number) => deleteProductItem(companyId), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-items'] });
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
