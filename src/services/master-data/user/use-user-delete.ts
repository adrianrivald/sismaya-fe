import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

async function deleteUserById(userId: number) {
    await http(`users/${userId}`, {
      method: 'DELETE',
    });
  }
  
  export function useDeleteUserById() {
    const queryClient = useQueryClient();
  
  
    return useMutation(
      (userId: number) => deleteUserById(userId),
      {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["user"]})
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
  