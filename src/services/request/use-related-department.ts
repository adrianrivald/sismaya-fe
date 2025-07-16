import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { http } from 'src/utils/http';

export type UpdateRelatedDepartment = {
  request_id: number;
  department_id: number;
};

export function useAddRelatedDepartment() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation(
    async (formData: UpdateRelatedDepartment) => {
      const { request_id, department_id } = formData;

      return http(`requests-department`, {
        data: {
          request_id,
          department_id,
        },
      });
    },
    {
      onSuccess: (res: any) => {
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
        const reason = error instanceof Error ? error.message : 'Something went wrong';

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

async function deleteRelatedDepartment(requestDepartmentId: number) {
  await http(`requests-department/${requestDepartmentId}`, {
    method: 'DELETE',
  });
}

export function useDeleteRelatedDepartment() {
  const queryClient = useQueryClient();

  return useMutation(
    (requestDepartmentId: number) => deleteRelatedDepartment(requestDepartmentId),
    {
      onSuccess: () => {
        toast.success('Success delete item', {
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
        const reason = error instanceof Error ? error.message : 'Something went wrong';

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
