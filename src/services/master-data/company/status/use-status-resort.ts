import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

export type ReSortStatus = {
  company_id: number;
  progress_status_id: string;
};

export function useReSortStatus() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: ReSortStatus) => {
        const { company_id, progress_status_id } = formData;
  
  
        return http(`progress-status/resort`, {
        method: "GET",
          params: {
          company_id,
          progress_status_id
          },
        });
      },
      {
          onSuccess: (res: any) => {
          toast.success('Data updated successfully', {
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