import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import type { CategoryTypes } from 'src/sections/master-data/master-category/type/types';

export function useCategoryDetail(id: number) {
  const { data, isLoading, isError } = useQuery({
    enabled: id !== 0,
    queryKey: ['categories', id],
    queryFn: () => http(`categories/${id}`),
  });
  return {
    data: data?.data as CategoryTypes,
    isLoading,
    isError,
  };
}
