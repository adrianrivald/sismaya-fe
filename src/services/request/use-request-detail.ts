import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";

async function fetchRequestByID(requestId: number) {
    const { data } = await http<{data : any}>(
      `requests/${requestId}`,
    );
  
    return data;
  }
  
  export function useRequestById(requestId: number) {
    const data = useQuery(
      ['request-items', requestId],
      () => fetchRequestByID(requestId),
      {
        enabled: requestId !== undefined,
      }
    );
  
    return data;
  }