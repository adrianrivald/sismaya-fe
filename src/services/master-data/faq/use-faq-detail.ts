import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import { FaqType } from './types/type';

async function fetchCompanyById(faqId: number) {
  const { data } = await http<{ data: FaqType }>(`faq/${faqId}`);

  return data;
}

export function useFaqById(faqId: number) {
  const data = useQuery(['faq-items', faqId], () => fetchCompanyById(faqId), {
    enabled: faqId !== 0,
  });

  return data;
}
