import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

interface WorkPerformanceParams {
  internalCompanyId: string;
  userId?: string[];
  period: string;
  from?: string;
  to?: string;
  reportType: string;

}



export function useReportWorkPerformance() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: WorkPerformanceParams) => {
        const {reportType, ...form} = formData

        const stringifiedUserIds = form.userId?.map(String)
        console.log(stringifiedUserIds?.join(','),'useridddd');
        const params =  {
          internal_company_id: form.internalCompanyId,
          user_id: stringifiedUserIds?.join(','),
          period: form.period
        }

        console.log(params,'paramsparams')
        
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
  
  