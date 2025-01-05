import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

export type PriorityRequest = {id: number, priority: string};

export function useUpdateRequestPriority() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: PriorityRequest) => {
        const {id, priority} = formData
        return http(`requests/${id}/priority`, {
          method: "POST",
          data: {
            priority
          }
        });
      },
      {
        // onSuccess: (res: {data: PriorityRequest}) => {
          onSuccess: (res: any) => {
          queryClient.invalidateQueries(['request-items']);
  
          toast.success('Request priority has been updated', {
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
  