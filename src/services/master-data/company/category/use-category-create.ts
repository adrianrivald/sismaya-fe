import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

export type StoreCategory = {
  name:string;
  company_id?: number[];
  is_active?:boolean;
};

export function useAddCategory() {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    return useMutation(
      async (formData: StoreCategory) => {
        const { name, company_id, is_active } = formData;
  
  
        return http(`categories`, {
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
          toast.success('Data added successfully', {
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