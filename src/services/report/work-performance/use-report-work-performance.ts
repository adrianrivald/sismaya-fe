import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

interface WorkPerformanceParams {
  userId: string;
  period: string;
  from?: string;
  to?: string;
}



export function useReportWorkPerformance() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: WorkPerformanceParams) => {
        const params =  {
          user_id: formData.userId,
          period: formData.period
        }
        
        if (formData.from) {
          Object.assign(params, {
            from: formData.from,
            to: formData.to
          })
        }
        
        return http(`performance-report/overall`, {
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
  
  