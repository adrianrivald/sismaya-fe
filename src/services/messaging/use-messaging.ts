import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { uploadImage } from "src/services/utils/upload-image";
import { http } from "src/utils/http";
import type { Messaging } from "./types";

export type StoreMessage = {request_id: number, content: string} & {file?: any};

async function fetchMessage({request_id, page}: {request_id: number, page: number}) {
    const { data, meta } = await http<{data : Messaging[], meta: any}>(
      `messages?request_id=${request_id}&page=${page}`,
    );
  
    console.log(meta,'metameta')

    return {messages: data, meta};
  }
  
  export function useMessage(request_id: number, page: number) {
    const data = useQuery(
      ['messaging', page],
      () => fetchMessage({request_id, page}),
      {
        refetchOnWindowFocus: true, // Enables refetching when window regains focus
      }
    );
  
    return data;
  }


// Post Message
export function useMessagePost(onSuccess: (newData: any)=>void) {
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
          onSuccess: (res) => {
          queryClient.invalidateQueries({
            queryKey: ['messaging', 1]
          });
          const newData = res?.data[0]
          onSuccess(newData)
  

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
  