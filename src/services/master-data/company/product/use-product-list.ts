import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Products } from "../types";

export function useProductByCompanyId(companyId: number, isClientCompany?: boolean, onSuccess?: () => void, internalCompanyId?: number) {
  console.log(internalCompanyId,'internalCompanyId')
    return useQuery(['product-items', companyId], async () => {
      const { data: response } = await http<{ data: Products[] }>(
        isClientCompany ? `products?client_company_id=${companyId}${internalCompanyId ? `&company_id=${internalCompanyId}` : ""}` : `products?company_id=${companyId}${internalCompanyId ? `&company_id=${internalCompanyId}` : ""}`
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