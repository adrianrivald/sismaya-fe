import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

interface DepartmentIdParams {
  companyId: string;
  departmentName: string;
}

export function useDepartmentId() {
    return useMutation(
      async (formData: DepartmentIdParams) => {
        const params =  {
          company_id: formData.companyId,
          department_name: formData.departmentName
        }
        
        return http(`department/id`, {
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
  
  