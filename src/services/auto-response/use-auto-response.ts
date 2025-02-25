import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";
import type { AutoResponse } from "./types";
import { AutoResponseDTO } from "./schemas/auto-response-schema";


export function useAddAutoResponse() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: AutoResponseDTO) => {
  
        const payload =  {
          ...formData
        }
        
        
        return http(`auto-reply-messages`, {
          data: payload
        });
      },
      {
          onSuccess: () => {
  
          toast.success('Auto-Response Settings Saved Succesfully', {
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
  