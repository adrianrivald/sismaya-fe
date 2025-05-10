import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

export function useDepartmentName() {
    return useMutation(
      async (companyId: string) => {
        const params =  {
          company_id: companyId
        }
        
        return http(`department/name`, {
          method: "GET",
          params: {...params}
        });
      },
      {
          onSuccess: () => {
            // queryClient.invalidateQueries(['report-request'])
         

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
  
  