import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { uploadFilesBulk, uploadImage } from "src/services/utils/upload-image";
import { http } from "src/utils/http";
import { RequestDTO } from "./schemas/request-schema";
import { Attachment } from "./types";

export type UpdateRequest = RequestDTO & {id: number, files?: any, attachments?: Attachment[], start_date?: any, end_date?: any};

export function useUpdateRequest(internalCompany: string) {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    return useMutation(
      async (formData: UpdateRequest) => {
        const { files, id, ...form } = formData;
        const payload =  {
          ...form
        }

        // if ((form?.attachments ?? [])?.length > 0) {
        //   Object.assign(payload, {
        //     attachments: form?.attachments?.map(item => ({
        //         file_path: item?.file_path,
        //         file_name: item?.file_name
        //     }))
        //   });
        // } 
        
        
        return http(`requests/${id}`, {
          data: payload,
          method: "PUT"
        });
      },
      {
          onSuccess: (res: any) => {
          queryClient.invalidateQueries(['request']);
  
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
          navigate(`/${internalCompany}/request`)
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
  