import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Company } from "./types";

async function fetchCompanies(type : string) {
    const { data } = await http<{data : Company[]}>(
      !type ? `companies` :  type === "internal" ? `companies?type=vendor` : `companies?type=holding`,
    );
  
    return data;
  }
  
  export function useCompanies(type: string) {
    const data = useQuery(
      ['company-items-all'],
      () => fetchCompanies(type)
    );
  
    return data;
  }