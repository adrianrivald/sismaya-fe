import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import { StatusDTO } from './schema/status-schema';

export function useStatusDetail(id: number) {
  const { data, isLoading, isError } = useQuery({
    enabled: id !== 0,
    queryKey: ['progress-status', id],
    queryFn: () => http(`progress-status/${id}`),
  });
  return {
    data: data?.data as StatusDTO,
    isLoading,
    isError,
  };
}
