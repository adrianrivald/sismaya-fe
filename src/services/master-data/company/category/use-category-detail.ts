import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import { CategoryDTO } from './schema/category-schema';

export function useCategoryDetail(id: number) {
  const { data, isLoading, isError } = useQuery({
    enabled: id !== 0,
    queryKey: ['categories', id],
    queryFn: () => http(`categories/${id}`),
  });
  return {
    data: data?.data as CategoryDTO,
    isLoading,
    isError,
  };
}
