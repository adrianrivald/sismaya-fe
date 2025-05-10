import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import { ProductDTO } from './schema/product-schema';

export function useProductDetail(id: number) {
  const { data, isLoading, isError } = useQuery({
    enabled: id !== 0,
    queryKey: ['product', id],
    queryFn: () => http(`products/${id}`),
  });
  return {
    data: data?.data as ProductDTO,
    isLoading,
    isError,
  };
}
