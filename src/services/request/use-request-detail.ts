import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { RequestDetail } from "./types";

async function fetchRequestByID(requestId: string) {
    const { data } = await http<{data : RequestDetail}>(
      `requests/${requestId}`,
    );
  
    return data;
  }
  
  export function useRequestById(requestId: string) {
    const data = useQuery(
      ['request-items', requestId],
      () => fetchRequestByID(requestId),
      {
        enabled: requestId !== undefined,
      }
    );
  
    return data;
  }