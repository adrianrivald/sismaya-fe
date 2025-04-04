import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Products } from "../types";

export function useProductByCompanyId(companyId: number, isClientCompany?: boolean, onSuccess?: () => void) {
    return useQuery(['product-items', companyId], async () => {
      const { data: response } = await http<{ data: Products[] }>(
        isClientCompany ? `products?client_company_id=${companyId}` : `products?company_id=${companyId}`
      );
  
      return response;
    }, 
    {
      onSuccess: () => {
        console.log('onsuc')
        onSuccess?.()
      },
      enabled: companyId !== null || companyId !== 0,
    },);
  }