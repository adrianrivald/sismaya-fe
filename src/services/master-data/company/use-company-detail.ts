import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Company } from "./types";

async function fetchCompanyById(companyId: number) {
    const { data } = await http<{data : Company}>(
      `companies/${companyId}`,
    );
  
    return data;
  }
  
  export function useCompanyById(companyId: number) {
    const data = useQuery(
      ['company-items', companyId],
      () => fetchCompanyById(companyId),
      {
        enabled: companyId !== undefined,
      }
    );
  
    return data;
  }