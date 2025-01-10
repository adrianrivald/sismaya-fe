import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

export type UpdateStatus = {id: number, statusId: number};

export function useUpdateRequestStatus() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: UpdateStatus) => {
        const {id, statusId} = formData
        return http(`requests/${id}/status`, {
          method: "POST",
          data: {
            status_id: statusId
          }
        });
      },
      {
        // onSuccess: (res: {data: CompleteRequest}) => {
          onSuccess: (res: any) => {
          queryClient.invalidateQueries(['request-items']);
  
          toast.success('Request status has been updated', {
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
  