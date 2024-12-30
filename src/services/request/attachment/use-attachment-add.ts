import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { uploadFilesBulk, uploadImage } from "src/services/utils/upload-image";
import { http } from "src/utils/http";
import { Attachment } from "../types";

export type StoreAttachment = {request_id: number, files: any};

export function useAddAttachment() {
    const queryClient = useQueryClient();
    const { vendor } = useParams()
    const navigate = useNavigate()
    return useMutation(
      async (formData: StoreAttachment) => {
        const { files, ...form } = formData;
        const payload =  {
          ...form
        }
        
          if(files) {
            
          const filesData = new FormData();
          Array.from(files).forEach((file, index) => {
          filesData.append(`files`, file as unknown as File);
          });
          const {data} = await uploadFilesBulk(
            filesData
          );
          Object.assign(payload, {
            attachments: data?.map(item => ({
                file_path: item?.path,
                file_name: item?.filename
            }))
          });
          }
        
        return http(`requests-attachment`, {
          data: payload
        });
      },
      {
        // onSuccess: (res: {data: StoreAttachment}) => {
          onSuccess: () => {
          queryClient.invalidateQueries(['request-items']);
  
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
  