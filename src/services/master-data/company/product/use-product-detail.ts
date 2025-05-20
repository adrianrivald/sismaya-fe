import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import type { ProductTypes } from 'src/sections/master-data/master-product/type/types';

export function useProductDetail(id: number) {
  const { data, isLoading, isError } = useQuery({
    enabled: id !== 0,
    queryKey: ['product', id],
    queryFn: () => http(`products/${id}`),
  });
  return {
    data: data?.data as ProductTypes,
    isLoading,
    isError,
  };
}
