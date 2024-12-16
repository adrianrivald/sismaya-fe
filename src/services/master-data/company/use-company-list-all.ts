import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Company } from "./types";

async function fetchCompanies() {
    const { data } = await http<{data : Company[]}>(
      `companies`,
    );
  
    return data;
  }
  
  export function useCompanies() {
    const data = useQuery(
      ['company-items-all'],
      () => fetchCompanies()
    );
  
    return data;
  }