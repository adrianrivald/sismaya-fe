import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import {  Statuses } from "../types";

export function useStatusByCompanyId(companyId: number) {
    return useQuery(['status-items', companyId], async () => {
      const { data: response } = await http<{ data: Statuses[] }>(
        `progress-status?company_id=${companyId}`
      );
  
      return response;
    });
  }