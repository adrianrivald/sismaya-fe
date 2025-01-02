import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

async function deleteRequestAssigneeById(requestAssigneeId: number) {
    await http(`requests-assignee/${requestAssigneeId}`, {
      method: 'DELETE',
    });
  }
  
  export function useDeleteRequestAssigneeById() {
    const queryClient = useQueryClient();
  
  
    return useMutation(
      (requestAssigneeId: number) => deleteRequestAssigneeById(requestAssigneeId),
      {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["request-items"]})
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
  