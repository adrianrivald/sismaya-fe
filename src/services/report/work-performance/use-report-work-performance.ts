import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

interface WorkPerformanceParams {
  internalCompanyId: string;
  userId?: string[];
  department_id?: string[];
  period: string;
  from?: string;
  to?: string;
  reportType: string;
  include_individual?: string;
  breakdown_by_request?: string;
}



export function useReportWorkPerformance() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: WorkPerformanceParams) => {
        const {reportType, ...form} = formData

        const stringifiedUserIds = form.userId?.map(String)
        const stringifiedDepartmentIds = form.department_id?.map(String)
        const params =  {
          internal_company_id: form.internalCompanyId,
          user_id: stringifiedUserIds?.join(','),
          department_id: stringifiedDepartmentIds?.join(','),
          period: form.period
        }

        if (form.include_individual){
            Object.assign(params, {
            include_individual: "true"
          })
        }

        if (form.breakdown_by_request){
            Object.assign(params, {
            breakdown_by_request: "true"
          })
        }

        if (formData.from) {
          Object.assign(params, {
            from: form.from,
            to: form.to
          })
        }
        
        return http(`performance-report/${reportType}`, {
          method: "GET",
          params: {...params}
        });
      },
      {
          onSuccess: () => {
            queryClient.invalidateQueries(['report-work-performance'])
          toast.success('Report Work Performance Generated Succesfully', {
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
  
  