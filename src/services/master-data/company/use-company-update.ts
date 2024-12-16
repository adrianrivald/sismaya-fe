import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";
import { CompanyDTO } from "../schemas/company-schema";

export type UpdateCompany = CompanyDTO & {id: number, type: string};

export function useUpdateCompany() {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    return useMutation(
      async (formData: UpdateCompany) => {
        const { name, abbreviation, type, id } = formData;
  
  
        return http(`companies/${id}`, {
            method: "PUT",
            data: {
                name,
                abbreviation,
                type
            },
        });
      },
      {
        // onSuccess: (res: {data: UpdateCompany}) => {
          onSuccess: (res: any) => {
          console.log(res,'res')
          queryClient.invalidateQueries(['company']);
  
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
          if (res?.data?.type === "holding") {
            navigate(`/client-company/`)
          } else {
            navigate(`/internal-company/`)

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
  