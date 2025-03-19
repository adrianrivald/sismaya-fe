import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Products } from "../types";

export function useProductByCompanyId(companyId: number, isClientCompany?: boolean) {
    return useQuery(['product-items', companyId], async () => {
      const { data: response } = await http<{ data: Products[] }>(
        isClientCompany ? `products?client_company_id=${companyId}` : `products?company_id=${companyId}`
      );
  
      return response;
    });
  }