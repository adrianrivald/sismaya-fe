import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";

interface ProductUseParams {
  clientCompanyId: number;
  internalCompanyId: number;
}

async function fetchProduceUseDetail({clientCompanyId, internalCompanyId} : ProductUseParams) {
    const { data } = await http<{data : any}>(
      `product-use/fetch-detail?client_company_id=${clientCompanyId}&internal_company_id=${internalCompanyId}`,
    );
  
    return data;
  }
  
  export function useProductUseById({clientCompanyId, internalCompanyId} : ProductUseParams) {
    const data = useQuery(
      ['company-items', clientCompanyId, internalCompanyId],
      () => fetchProduceUseDetail({clientCompanyId, internalCompanyId}),
      {
        enabled: clientCompanyId !== undefined && internalCompanyId !== undefined,
      }
    );
  
    return data;
  }