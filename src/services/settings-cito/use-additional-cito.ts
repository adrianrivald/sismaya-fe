import { http } from 'src/utils/http';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Bounce, toast } from 'react-toastify';
import { AdditionalCitoListType } from './schemas/type';

async function fetchAdditionalQuotaList(params: any, company_id: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL(`/additional-quota?company_id=${company_id}`, baseUrl);

  const { data } = await http<{
    data: AdditionalCitoListType[];
  }>(endpointUrl.toString().replace(baseUrl, ''));

  return data;
}

async function fetchAdditionalQuotaShow(params: any, additional_id: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL(`/additional-quota/${additional_id}`, baseUrl);

  const { data } = await http<{
    data: AdditionalCitoListType[];
  }>(endpointUrl.toString().replace(baseUrl, ''));

  return data;
}

export function useAdditionalQuota(params: any, company_id: string, enabled: boolean = true) {
  const data = useQuery(
    ['aditional-cito', params, company_id],
    () => fetchAdditionalQuotaList(params, company_id),
    { enabled }
  );

  return data;
}

export function useAdditionalQuotaShow(
  params: any,
  additional_id: string,
  enabled: boolean = true
) {
  const data = useQuery(
    ['aditional-cito-show', params, additional_id],
    () => fetchAdditionalQuotaShow(params, additional_id),
    { enabled }
  );

  return data;
}

export function useAdditionalQuotaDraft(
  company_id: number,
  onClickAdditional: (data: AdditionalCitoListType) => void
) {
  return useMutation(
    () =>
      // @ts-ignore
      http(`additional-quota-draft/${company_id}`, {
        method: 'POST',
      }),
    {
      onSuccess: (data) => {
        onClickAdditional(data.data as AdditionalCitoListType);
      },
    }
  );
}

export function useUpdateAdditionalQuota(additional_id: number, onSuccessSubmit?: () => void) {
  return useMutation(
    (formData: {
      details: { id: number; quota: number }[];
      po_number: string;
      documents: string[];
    }) =>
      // @ts-ignore
      http(`additional-quota/${additional_id}`, {
        method: 'POST',
        data: formData,
      }),
    {
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        onSuccessSubmit && onSuccessSubmit();
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
