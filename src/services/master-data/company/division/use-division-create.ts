import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

export type StoreDeparment = {
  name:string;
  company_id?: number
};

export function useAddDivision() {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    return useMutation(
      async (formData: StoreDeparment) => {
        const { name, company_id } = formData;
  
  
        return http(`departments`, {
          data: {
            name,
            company_id
          },
        });
      },
      {
          onSuccess: (res: any) => {
          const companyId = res?.data?.company_id
          console.log(companyId,'companyId')
          queryClient.invalidateQueries(['company-items', companyId]);
          queryClient.invalidateQueries(['division-items', companyId]);
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