import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Company } from "./types";

async function fetchCompanies(type : string) {
    const { data } = await http<{data : Company[]}>(
      !type ? `companies` :  type === "internal" ? `companies?type=vendor` : `companies?type=holding`,
    );
  
    return data;
  }
  
  
async function fetchInternalCompanies() {
  const { data } = await http<{data : Company[]}>('companies?type=vendor');

  return data;
}



  export function useCompanies(type: string) {
    const data = useQuery(
      ['company-items-all'],
      () => fetchCompanies(type)
    );
  
    return data;
  }

  export function useClientCompanies() {
    const data = useQuery(
      ['client-company-items-all'],
      () => fetchCompanies("client")
    );
  
    return data;
  }
  
  export function useInternalCompanies() {
    const data = useQuery(
      ['internal-company-items-all'],
      () => fetchInternalCompanies()
    );
  
    return data;
  }