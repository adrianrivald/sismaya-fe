import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";

export type StoreUserProduct = {
  user_id: number;
  product_id?: number | null
};

export function useAddUserProduct() {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    return useMutation(
      async (formData: StoreUserProduct) => {
        const { user_id, product_id } = formData;
  
  
        return http(`user-product`, {
          data: {
            user_id,
            product_id
          },
        });
      },
      {
          onSuccess: (res: any) => {
          const user_id = res?.data?.user_id
          queryClient.invalidateQueries({queryKey: ['user-items', user_id]});
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