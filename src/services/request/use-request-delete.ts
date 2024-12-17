import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

async function delelteRequestById(requestId: number) {
    await http(`requests/${requestId}`, {
      method: 'DELETE',
    });
  }
  
  export function useDeleteRequestById() {
    const queryClient = useQueryClient();
  
  
    return useMutation(
      (requestId: number) => delelteRequestById(requestId),
      {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["request"]})
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
  