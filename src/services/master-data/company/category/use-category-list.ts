import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Categories } from "../types";

export function useCategoryByCompanyId(companyId: number) {
    return useQuery(['category-items', companyId], async () => {
      const { data: response } = await http<{ data: Categories[] }>(
        `categories?company_id=${companyId}`
      );
  
      return response;
    });
  }