import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { uploadFilesBulk, uploadImage } from "src/services/utils/upload-image";
import { http } from "src/utils/http";
import type { Messaging } from "./types";

export type StoreMessage = {request_id: number, content: string} & {file?: any};

async function fetchMessage(request_id: number) {
    const { data } = await http<{data : Messaging[]}>(
      `messages?request_id=${request_id}`,
    );
  
    return data;
  }
  
  export function useMessage(request_id: number) {
    const data = useQuery(
      ['messaging'],
      () => fetchMessage(request_id)
    );
  
    return data;
  }


// Post Message
export function useMessagePost() {
    const queryClient = useQueryClient();
    return useMutation(
      async (formData: StoreMessage) => {
        const { file, ...form } = formData;
        const payload =  {
          ...form
        }
        
          if(file) {
            
          const fileData = new FormData();
          
          fileData.append(`file`, file as unknown as File);
          const {filename, path} = await uploadImage(
            fileData
          );
          Object.assign(payload, {
            file_path: path,
            file_name: filename
          });
          }
        
        return http(`messages`, {
          data: payload
        });
      },
      {
          onSuccess: () => {
          queryClient.invalidateQueries(['messaging']);
  

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
  