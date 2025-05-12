import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

export type UpdateStatus = {
  name: string;
  id: number;
  company_id: number;
  step: string;
  sort: number
  is_active?: boolean;
};

export function useUpdateStatus() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: UpdateStatus) => {
        const { name, id, company_id, step, sort, is_active } = formData;
  
  
        return http(`progress-status/${id}`, {
        method: "PUT",
          data: {
            name,
            company_id,
            step,
            sort,
            is_active
          },
        });
      },
      {
          onSuccess: (res: any) => {
          const companyId = res?.data?.company_id
          queryClient.invalidateQueries({queryKey: ['company-items', companyId]});
          queryClient.invalidateQueries(['status-items', companyId]);
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