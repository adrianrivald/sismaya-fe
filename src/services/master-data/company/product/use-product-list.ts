import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Products } from "../types";

export function useProductByCompanyId(companyId: number) {
    return useQuery(['product-items', companyId], async () => {
      const { data: response } = await http<{ data: Products[] }>(
        `products?company_id=${companyId}`
      );
  
      return response;
    });
  }