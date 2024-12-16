import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";
import { Categories } from "../types";

async function deleteCategoryItem(categoryId: number) {
    await http<{ data: Categories }>(`categories/${categoryId}`, {
      method: 'DELETE',
    });
  }
  
  export function useDeleteCategoryItem(companyId: number) {
    const queryClient = useQueryClient();
  
  
    return useMutation(
      (categoryId: number) => deleteCategoryItem(categoryId),
      {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['company-items', companyId]});
          toast.success("Success delete item", {
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
  