import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

export type ReviewRequest = {id: number, rating: number, description: string };

export function useAddRequestReview() {
    const queryClient = useQueryClient();
    const { vendor } = useParams()
    const navigate = useNavigate()
    return useMutation(
      async (formData: ReviewRequest) => {
        const { id, ...form} = formData
        const payload =  {
          ...form
        }
        
        
        return http(`requests/${id}/rating`, {
          data: payload
        });
      },
      {
          onSuccess: () => {
          queryClient.invalidateQueries(['request-items']);
  
          toast.success('Request Reviewed', {
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
          // navigate(`/${vendor}/request/${requestId}`)

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
  