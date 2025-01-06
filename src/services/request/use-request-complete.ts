import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

export type CompleteRequest = {id: number};

export function useCompleteRequest() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: CompleteRequest) => {
        const {id} = formData
        return http(`requests/${id}/complete`, {
          method: "POST"
        });
      },
      {
        // onSuccess: (res: {data: CompleteRequest}) => {
          onSuccess: (res: any) => {
          queryClient.invalidateQueries(['request-items']);
  
          toast.success('Request has been completed', {
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
  