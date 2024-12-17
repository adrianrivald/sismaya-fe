import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { uploadImage } from "src/services/utils/upload-image";
import { http } from "src/utils/http";
import { UserDTO } from "./schemas/user-schema";

export type StoreUser = UserDTO & {cover?: any};

export function useAddUser() {
    const navigate = useNavigate()
    return useMutation(
      async (formData: StoreUser) => {
        const {cover, ...form} = formData;
        
      const imageData = new FormData();
      imageData.append('file', cover as unknown as File);
      const { url } = await uploadImage(
        imageData
      );

        return http(`users`, {
          data: {
            ...form,
            profile_picture: url
          },
        });
      },
      {
          onSuccess: () => {
      
  
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
          navigate(`/user`)

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
  