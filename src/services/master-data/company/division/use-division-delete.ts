import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import { http } from "src/utils/http";
import { Department } from "../types";

async function deleteDivisionItem(divisionId: number) {
    await http<{ data: Department }>(`departments/${divisionId}`, {
      method: 'DELETE',
    });
  }
  
  export function useDeleteDivisionItem() {
    const queryClient = useQueryClient();
  
  
    return useMutation(
      (divisionId: number) => deleteDivisionItem(divisionId),
      {
        onSuccess: () => {
          toast.success("Success delete item", {
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
  