import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { uploadFilesBulk, uploadImage } from "src/services/utils/upload-image";
import { http } from "src/utils/http";
import { RequestDTO } from "./schemas/request-schema";

export type StoreRequest = RequestDTO & {files?: any};

export function useAddRequest() {
    const queryClient = useQueryClient();
    const { vendor } = useParams()
    const navigate = useNavigate()
    return useMutation(
      async (formData: StoreRequest) => {
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
            console.log(data,'datan')
          Object.assign(payload, {
            attachments: data?.map(item => ({
                file_path: item?.path,
                file_name: item?.filename
            }))
          });
          }
        
        return http(`requests`, {
          data: payload
        });
      },
      {
        // onSuccess: (res: {data: StoreRequest}) => {
          onSuccess: (res: any) => {
          queryClient.invalidateQueries(['request']);
  
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
          navigate(`/${vendor}/request`)

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
  