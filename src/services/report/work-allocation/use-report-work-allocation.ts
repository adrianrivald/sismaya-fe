import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

interface WorkAllocationParams {
  internalCompanyId: string;
  period: string;
  from?: string;
  to?: string;
}



export function useReportWorkAllocation() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: WorkAllocationParams) => {
        console.log(formData,'formData')
        const params =  {
          internal_company_id: formData.internalCompanyId,
          period: formData.period
        }
        
        if (formData.from) {
          Object.assign(params, {
            from: formData.from,
            to: formData.to
          })
        }
        
        return http(`allocation-report`, {
          method: "GET",
          params: {...params}
        });
      },
      {
          onSuccess: () => {
            queryClient.invalidateQueries(['report-work-allocation'])
          toast.success('Report Work Allocation Generated Succesfully', {
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
  
  