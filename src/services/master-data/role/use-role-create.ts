import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";
import type { RoleDTO } from "./schemas/role-schema";

export type StoreRole = RoleDTO

export function useAddRole() {
    const navigate = useNavigate()
    return useMutation(
      async (formData: StoreRole) => {
        const payload = {
          ...formData,
        }
        return http(`roles`, {
          data: payload
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
          navigate('/access-control/user-group')

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
  