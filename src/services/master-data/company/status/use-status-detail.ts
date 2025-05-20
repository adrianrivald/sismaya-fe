import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import type { StatusTypes } from 'src/sections/master-data/master-status/type/types';

export function useStatusDetail(id: number) {
  const { data, isLoading, isError } = useQuery({
    enabled: id !== 0,
    queryKey: ['progress-status', id],
    queryFn: () => http(`progress-status/${id}`),
  });
  return {
    data: data?.data as StatusTypes,
    isLoading,
    isError,
  };
}
