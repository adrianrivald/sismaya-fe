import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { uploadImage } from 'src/services/utils/upload-image';
import { http } from 'src/utils/http';
import { CompanyDTO } from './schemas/company-schema';
import { Company } from './types';

export type StoreCompany = CompanyDTO & { type: string; cover?: any; parent_id?: string };

export function useAddCompany() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  return useMutation(
    async (formData: StoreCompany) => {
      const { name, abbreviation, type, cover, parent_id } = formData;
      const payload = {
        name,
        abbreviation,
        type,
      };

      if (cover) {
        const imageData = new FormData();
        imageData.append('file', cover as unknown as File);
        const { url } = await uploadImage(imageData);

        Object.assign(payload, {
          image: url,
        });
      }


      if (parent_id) {
        Object.assign(payload, {
          parent_id,
        });
      }

      return http(`companies`, {
        data: payload,
      });
    },
    {
      // onSuccess: (res: {data: StoreCompany}) => {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries(['company']);

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
        if (res?.data?.type === 'holding') {
          navigate(`/client-company/companies/`);
        } else if (res?.data?.type === 'internal') {
          navigate(`/internal-company/companies/`);
        } else {
          const currentPath = location.pathname;
          const slicedPath = currentPath?.split('/edit')[0];
          navigate(`${slicedPath}/${res?.data?.id}/edit`);
        }
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
