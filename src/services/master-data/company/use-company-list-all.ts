import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import { Company } from './types';

async function fetchCompanies(type: string, showAll?: boolean) {
  const { data } = await http<{ data: Company[] }>(
    !type
      ? `companies`
      : type === 'internal'
        ? `companies?type=internal${showAll ? '&page_size=99999' : '&page_size=10'}`
        : type === 'client'
          ? `companies?type=holding${showAll ? '&page_size=99999' : '&page_size=10'}`
          : `companies?type=non_internal${showAll ? '&page_size=99999' : '&page_size=10'}`
  );

  return data;
}

async function fetchInternalCompanies() {
  const { data } = await http<{ data: Company[] }>('companies?type=internal');

  return data;
}

export function useCompanies(type: string) {
  const data = useQuery(['company-items-all'], () => fetchCompanies(type));

  return data;
}

  export function useClientCompanies(showAll?: boolean, isClient?: boolean) {
    const data = useQuery(
      ['client-company-items-all'],
      () => fetchCompanies("client", showAll),
      {
        enabled: isClient || true
      }
    );
  
    return data;
  }
  export function useNonInternalCompanies(showAll?: boolean) {
    const data = useQuery(
      ['non-internal-company-items-all'],
      () => fetchCompanies("non-internal", showAll)
    );
  
    return data;
  }
  
  export function useInternalCompanies(isInternal?: boolean) {
    const data = useQuery(
      ['internal-company-items-all'],
      () => fetchInternalCompanies(),
      {
        enabled: isInternal || true
      }
    );
  
    return data;
  }

  
export function useInternalCompaniesAll() {
  const data = useQuery(['internal-company-items-all'], () => fetchCompanies('internal', true));
  return data;
}