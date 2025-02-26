import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";
import type { AutoResponseDTO } from "./schemas/auto-response-schema";

async function fetchAutoResponseById(companyId: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/auto-reply-messages', baseUrl);

  
  if (companyId) {
    endpointUrl.searchParams.append('company_id', companyId);
  }


  const { data } = await http<{data:  any}>(
    endpointUrl.toString().replace(baseUrl, '')
  )

  return data
  }

  export function useAutoResponse(companyId: string) {
    const data = useQuery(
      ['auto-reply-messages', companyId],
      () => fetchAutoResponseById(companyId)
    );
  
    return data;
  }

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
            queryClient.invalidateQueries(['auto-reply-messages'])
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
  
  
export function useUpdateAutoResponse() {
  const queryClient = useQueryClient();
  return useMutation(
    async (formData: AutoResponseDTO & {id: number}) => {
      const {id, ...form} = formData
      const payload =  {
        ...form
      }
      
      
      return http(`auto-reply-messages/${id}`, {
        method: "PUT",
        data: payload
      });
    },
    {
        onSuccess: () => {
          queryClient.invalidateQueries(['auto-reply-messages'])
        toast.success('Auto-Response Settings Updated Succesfully', {
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
