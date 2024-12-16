import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Department } from "../types";

export function useDivisionByCompanyId(companyId: number) {
    return useQuery(['division-items', companyId], async () => {
      const { data: response } = await http<{ data: Department[] }>(
        `departments?company_id=${companyId}`
      );
  
      return response;
    });
  }