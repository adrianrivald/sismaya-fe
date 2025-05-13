import { useMutation } from '@tanstack/react-query';
import { toast, Bounce } from 'react-toastify';
import { http } from 'src/utils/http';

export function useArrangeMasterFaq() {
  return useMutation(
    async ({
      product_id,
      faqs,
    }: {
      product_id: number;
      faqs: { faq_id: number; sort: number }[];
    }) =>
      http(`faq/sort`, {
        method: 'POST',
        data: {
          product_id,
          faqs,
        },
      }),
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
