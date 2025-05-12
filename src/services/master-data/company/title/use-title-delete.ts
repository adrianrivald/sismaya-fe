import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

async function deleteTitleItem(categoryId: number) {
    await http<{ data: any }>(`titles/${categoryId}`, {
      method: 'DELETE',
    });
  }
  

  export function useDeleteTitle() {
    const queryClient = useQueryClient();
  
    return useMutation((companyId: number) => deleteTitleItem(companyId), {
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
  