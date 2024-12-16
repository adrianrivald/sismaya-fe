import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";
import { CompanyDTO } from "../schemas/company-schema";
import { Company } from "./types";

export type StoreCompany = CompanyDTO & {type: string};

export function useAddCompany() {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    return useMutation(
      async (formData: StoreCompany) => {
        const { name, abbreviation, type } = formData;
  
  
        return http(`companies`, {
          data: {
            name,
            abbreviation,
            type
          },
        });
      },
      {
        // onSuccess: (res: {data: StoreCompany}) => {
          onSuccess: (res: any) => {
          console.log(res,'res')
          queryClient.invalidateQueries(['company']);
  
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
          if (res?.data?.type === "holding") {
            navigate(`/client-company/${res?.data?.id}/edit`)
          } else {
            navigate(`/internal-company/${res?.data?.id}/edit`)

          }
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
  