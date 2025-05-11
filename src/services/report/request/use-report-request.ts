import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

interface ReportRequestParams {
  internalCompanyId: string;
  departmentId: string;
  period: string;
  from?: string;
  to?: string;
}



export function useReportRequest() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: ReportRequestParams) => {
        const params =  {
          department_id: formData?.departmentId,
          internal_company_id: formData.internalCompanyId,
          period: formData.period
        }
        
        if (formData.from) {
          Object.assign(params, {
            from: formData.from,
            to: formData.to
          })
        }
        
        return http(`request-log-reports`, {
          method: "GET",
          params: {...params}
        });
      },
      {
          onSuccess: () => {
            queryClient.invalidateQueries(['request-log-reports'])
          toast.success('Report Request Generated Succesfully', {
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
  
  