import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";
import { UserCompany } from "./types";

async function deleteUserProductById(userProductId: number) {
    await http<{ data: UserCompany }>(`user-product/${userProductId}`, {
      method: 'DELETE',
    });
  }
  
  export function useDeleteUserProductById(userId: number) {
    const queryClient = useQueryClient();
  
  
    return useMutation(
      (userProductId: number) => deleteUserProductById(userProductId),
      {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['user-items', userId]});
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
  