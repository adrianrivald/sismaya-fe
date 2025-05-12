import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";
import { Statuses } from "../types";

async function deleteStatusItem(statusId: number) {
    await http<{ data: Statuses }>(`progress-status/${statusId}`, {
      method: 'DELETE',
    });
  }
  
  export function useDeleteStatusItem(companyId: number) {
    const queryClient = useQueryClient();
  
  
    return useMutation(
      (statusId: number) => deleteStatusItem(statusId),
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
  
  
    export function useDeleteStatus() {
      const queryClient = useQueryClient();
    
      return useMutation((companyId: number) => deleteStatusItem(companyId), {
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