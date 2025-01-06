import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

export type StoreUserCompany = {
  user_id: number;
  company_id?: number | null
};

export function useAddUserCompany() {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    return useMutation(
      async (formData: StoreUserCompany) => {
        const { user_id, company_id } = formData;
  
  
        return http(`user-company`, {
          data: {
            user_id,
            company_id
          },
        });
      },
      {
          onSuccess: (res: any) => {
          const user_id = res?.data?.user_id
          queryClient.invalidateQueries({queryKey: ['user-items', user_id]});
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