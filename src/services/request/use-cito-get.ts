import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";

async function fetchCitoById(companyId: string) {
    const { data } = await http<{data : {quota: number, used: number}}>(
      `companies/${companyId}/cito`,
    );
  
    return data;
  }
  
  export function useCitoById(companyId: string) {
    const data = useQuery(
      ['cito-items', companyId],
      () => fetchCitoById(companyId),
      {
        enabled: companyId !== undefined,
      }
    );
  
    return data;
  }