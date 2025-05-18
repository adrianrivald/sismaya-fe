import { useMutation } from '@tanstack/react-query';
import { toast, Bounce } from 'react-toastify';
import { http } from 'src/utils/http';

export function useBulkDeleteTitle() {
  return useMutation(
    async (titleId: string) =>
      http(`titles/bulk?title_id=${titleId}`, {
        method: 'DELETE',
      }),
    {
      onSuccess: (res: any) => {
        toast.success('Data deleted successfully', {
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
