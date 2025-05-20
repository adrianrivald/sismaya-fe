import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import type { DivisionTypes } from 'src/sections/master-data/master-division/type/types';

export function useDivisionDetail(id: number) {
  const { data, isLoading, isError } = useQuery({
    enabled: id !== 0,
    queryKey: ['division', id],
    queryFn: () => http(`departments/${id}`),
  });
  return {
    data: data?.data as DivisionTypes,
    isLoading,
    isError,
  };
}
