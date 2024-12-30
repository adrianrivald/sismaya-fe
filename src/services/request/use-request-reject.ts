import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { uploadFilesBulk, uploadImage } from "src/services/utils/upload-image";
import { http } from "src/utils/http";
import { RequestDTO } from "./schemas/request-schema";

export type RejectRequest = {id: number, reason: string };

export function useRejectRequest() {
    const queryClient = useQueryClient();
    const { vendor } = useParams()
    const navigate = useNavigate()
    return useMutation(
      async (formData: RejectRequest) => {
        const { id, ...form} = formData
        const payload =  {
          ...form
        }
        
        
        return http(`requests/${id}/reject`, {
          data: payload
        });
      },
      {
        // onSuccess: (res: {data: RejectRequest}) => {
          onSuccess: (res: any) => {
            const requestId = res?.data?.request?.id
          queryClient.invalidateQueries(['request-items']);
  
          toast.success('Project Rejected', {
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
          navigate(`/${vendor}/request/${requestId}`)

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
  