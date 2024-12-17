import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { uploadImage } from "src/services/utils/upload-image";
import { http } from "src/utils/http";
import { CompanyDTO } from "./schemas/company-schema";

export type UpdateCompany = CompanyDTO & {id: number, type: string, cover?: any};

export function useUpdateCompany() {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    return useMutation(
      async (formData: UpdateCompany) => {
        const { name, abbreviation, type, id, cover } = formData;
        const payload = {
          name,
          abbreviation,
          type
      }

        if (cover) {

          const imageData = new FormData();
          imageData.append('file', cover as unknown as File);
          const { url } = await uploadImage(
            imageData
          );
  
          Object.assign(payload, {
            image: url,
          });
          
        }
  
        return http(`companies/${id}`, {
            method: "PUT",
            data: payload
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
  