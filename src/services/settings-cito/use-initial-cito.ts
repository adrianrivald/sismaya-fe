import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import { Bounce, toast } from 'react-toastify';
import { InitialCitoType } from './schemas/type';

async function fetchInitialQuota(params: any, company_id: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL(`/initial-quota?company_id=${company_id}`, baseUrl);

  const { data } = await http<{
    data: InitialCitoType;
  }>(endpointUrl.toString().replace(baseUrl, ''));

  return data;
}

export function useInitialQuota(params: any, company_id: string, enabled: boolean = true) {
  const data = useQuery(
    ['citos', params, company_id],
    () => fetchInitialQuota(params, company_id),
    { enabled }
  );

  return data;
}

export function useInitialQuotaPost() {
  const queryClient = useQueryClient();
  return useMutation(
    (formData: { cito_type: string; quotas: { company_id: number; quota: number }[] }) =>
      // @ts-ignore
      http('initial-quota', {
        method: 'POST',
        data: formData,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['request-log-reports']);
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
