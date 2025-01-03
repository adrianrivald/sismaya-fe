import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

export type StoreAssignee = {request_id: number; assignee_id: number};

export function useAddRequestAssignee() {
    const queryClient = useQueryClient();
    const { vendor } = useParams()
    const navigate = useNavigate()
    return useMutation(
      async (formData: StoreAssignee) => {
        const payload =  {
          ...formData
        }
        
       
        
        return http(`requests-assignee`, {
          data: payload
        });
      },
      {
          onSuccess: () => {
          queryClient.invalidateQueries(['request-items']);
  
          toast.success('Data added successfully', {
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
  