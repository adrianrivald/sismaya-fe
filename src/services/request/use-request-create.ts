import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { uploadImage } from "src/services/utils/upload-image";
import { http } from "src/utils/http";

export type StoreCompany = any & {type: string, cover?: any};

export function useAddCompany() {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    return useMutation(
      async (formData: StoreCompany) => {
        const { name, abbreviation, type, cover } = formData;
        const payload =  {
          name,
          abbreviation,
          type
        }

        if (type ===  "holding") {
          if(cover) {
            
          const imageData = new FormData();
          imageData.append('file', cover as unknown as File);
          const { url } = await uploadImage(
            imageData
          );
  
          Object.assign(payload, {
            image: url,
          });
          }
        }
  
        return http(`companies`, {
          data: payload
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
  