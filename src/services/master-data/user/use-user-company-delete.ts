import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";
import { UserCompany } from "./types";

async function deleteUserCompanyById(userCompanyId: number) {
    await http<{ data: UserCompany }>(`user-company/${userCompanyId}`, {
      method: 'DELETE',
    });
  }
  
  export function useDeleteUserCompanyById(userId: number) {
    const queryClient = useQueryClient();
  
  
    return useMutation(
      (userCompanyId: number) => deleteUserCompanyById(userCompanyId),
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
  