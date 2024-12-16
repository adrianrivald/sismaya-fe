import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Department } from "../types";

export async function fetchDivisionByCompanyId(companyId: number) {
  const { data } = await http<{ data: Department[] }>(`departments?company_id=${companyId}`);

  return data;
}

export function useDivisionByCompanyId(companyId: number) {
  const data = useQuery(
    ['division-items', companyId],
    () => fetchDivisionByCompanyId(companyId ?? ''),
    {
      enabled: companyId !== undefined,
    }
  );

  return data;
}