import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { uploadFilesBulk, uploadImage } from "src/services/utils/upload-image";
import { http } from "src/utils/http";
import { RequestDTO } from "./schemas/request-schema";

export type UpdateRequest = RequestDTO & {id: number, files?: any, attachments?: []};

export function useUpdateRequest() {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    return useMutation(
      async (formData: UpdateRequest) => {
        console.log(formData,'formDataformData')
        const { files,id, ...form } = formData;
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
        
        return http(`requests/${id}`, {
          data: payload,
          method: "PUT"
        });
      },
      {
          onSuccess: (res: any) => {
          console.log(res,'res')
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
          navigate(`/sim/request`)
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
  