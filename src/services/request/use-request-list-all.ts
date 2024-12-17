import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";

async function fetchRequests() {
    const { data } = await http<{data : any[]}>(
      `requests`,
    );
  
    return data;
  }
  
  export function useRequests() {
    const data = useQuery(
      ['request-items-all'],
      () => fetchRequests()
    );
  
    return data;
  }