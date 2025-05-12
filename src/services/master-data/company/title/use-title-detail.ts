import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import { TitleDTO } from './schema/title-schema';

export function useTitleDetail(id: number) {
  const { data, isLoading, isError } = useQuery({
    enabled: id !== 0,
    queryKey: ['titles', id],
    queryFn: () => http(`titles/${id}`),
  });
  return {
    data: data?.data as TitleDTO,
    isLoading,
    isError,
  };
}
