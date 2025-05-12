import { useMutation } from '@tanstack/react-query';

import { toast, Bounce } from 'react-toastify';
import { http } from 'src/utils/http';
import { FaqDTO } from './schemas/faq-schema';

export function useUpdateMasterFaq(faqId: number) {
  return useMutation(
    async (formData: FaqDTO) => {
      const { productId, answer, is_active, question } = formData;

      return http(`faq/${faqId}`, {
        method: 'PUT',
        data: {
          products: productId,
          question,
          answer,
          is_active: is_active ? 1 : 0,
        },
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
