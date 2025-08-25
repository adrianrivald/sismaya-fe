import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { uploadImage } from "src/services/utils/upload-image";
import { http } from "src/utils/http";
import type { CompanyDTO } from "./schemas/company-schema";

export type UpdateCompany = CompanyDTO & {id: number, type: string, cover?: any, image?:string, cito_quota?: number, subCompaniesCover?: any; clientSubCompanies?: any[] };

export function useUpdateCompany() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation()
    return useMutation(
      async (formData: UpdateCompany) => {
        const { id, cover, clientSubCompanies, subCompaniesCover, ...form } = formData;
        const payload = {
          ...form,
          sub_companies: clientSubCompanies,
        }
        

      
     if (subCompaniesCover?.length > 0) {
        await Promise.all(
          (clientSubCompanies ?? []).map(async (company, index) => {
            const imageData = new FormData();
            imageData.append("file", subCompaniesCover[index]);

            const { url } = await uploadImage(imageData);

            Object.assign(company, { image: url });
          })
        );
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
          queryClient.invalidateQueries(['company-items']);
  
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
            navigate(`/client-company/companies`)
          } else if (res?.data?.type === "internal") {
            navigate(`/internal-company/companies`)
          } else {
            const newPath = location.pathname.replace(/\/(\d+)\/\d+(\/edit)$/, "/$1$2");

            navigate(newPath)
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
  