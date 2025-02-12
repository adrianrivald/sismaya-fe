import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

async function deleteRoleById(roleId: number) {
    await http(`roles/${roleId}`, {
      method: 'DELETE',
    });
  }
  
  export function useDeleteRoleById() {
    const queryClient = useQueryClient();
  
  
    return useMutation(
      (roleId: number) => deleteRoleById(roleId),
      {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["roles"]})
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
  