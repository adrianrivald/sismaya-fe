import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast, Bounce } from 'react-toastify';
import { http } from 'src/utils/http';

async function deleteFaqItem(faqId: number) {
  await http(`faq/${faqId}`, {
    method: 'DELETE',
  });
}
export function useFaqDelete() {
  const queryClient = useQueryClient();

  return useMutation((companyId: number) => deleteFaqItem(companyId), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-list'] });
      toast.success('Item deleted successfully', {
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
  });
}
