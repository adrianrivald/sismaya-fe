import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

export type UpdateCategory = {
  name: string;
  id: number;
  company_id: number
  is_active?: boolean;
};

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: UpdateCategory) => {
        const { name, id, company_id, is_active } = formData;
  
  
        return http(`categories/${id}`, {
        method: "PUT",
          data: {
            name,
            company_id,
            is_active
          },
        });
      },
      {
          onSuccess: (res: any) => {
          const companyId = res?.data?.company_id
          queryClient.invalidateQueries({queryKey: ['company-items', companyId]});
          queryClient.invalidateQueries(['category-items', companyId]);
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