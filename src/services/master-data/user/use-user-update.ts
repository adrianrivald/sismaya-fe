import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { uploadImage } from 'src/services/utils/upload-image';
import { http } from 'src/utils/http';
import type { UserClientUpdateDTO } from './schemas/user-schema';

export type UpdateUser = UserClientUpdateDTO & { id: number; cover?: any; user_type: string };
export type UpdateUserPassword = { id: number; password: string; email: string };

export function useUpdateUser({ isRbac = false }: { isRbac?: boolean }) {
  const navigate = useNavigate();
  return useMutation(
    async (formData: UpdateUser) => {
      const { cover, id, ...form } = formData;
      const payload = {
        ...form,
      };

      if (cover) {
        const imageData = new FormData();
        imageData.append('file', cover as unknown as File);
        const { url } = await uploadImage(imageData);

        Object.assign(payload, {
          profile_picture: url,
        });
      }

      return http(`users/${id}`, {
        method: 'PUT',
        data: payload,
      });
    },
    {
      onSuccess: (res: any) => {
        const isClient = res?.data?.user_info?.company_id !== null;
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
        navigate(
          `${!isRbac ? (isClient ? '/client-user' : '/internal-user') : '/access-control/user-list'}`
        );
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

export function useUpdateUserChangeCompany({ isRbac = false }: { isRbac?: boolean }) {
  const navigate = useNavigate();
  return useMutation(
    async (formData: UpdateUser) => {
      const { cover, id, ...form } = formData;
      const payload = {
        ...form,
      };

      if (cover) {
        const imageData = new FormData();
        imageData.append('file', cover as unknown as File);
        const { url } = await uploadImage(imageData);

        Object.assign(payload, {
          profile_picture: url,
        });
      }

      return http(`users/${id}`, {
        method: 'PUT',
        data: payload,
      });
    },
    {
      onSuccess: (res: any) => {
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

export function useUpdateUserPassword() {
  const navigate = useNavigate();
  return useMutation(
    async (formData: UpdateUserPassword) => {
      const { id, ...form } = formData;
      const payload = {
        ...form,
      };

      return http(`users/${id}`, {
        method: 'PUT',
        data: payload,
      });
    },
    {
      onSuccess: () => {
        toast.success('Password has been changed successfully', {
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
        navigate(`/access-control/user-list`);
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
