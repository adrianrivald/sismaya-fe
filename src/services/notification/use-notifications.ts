import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";

async function fetchNotification() {
    const { data } = await http<{data : any[]}>(
      `notifications`,
    );
  
    return data;
  }
  
  export function useNotifications() {
    const data = useQuery(
      ['notifications'],
      () => fetchNotification()
    );
  
    return data;
  }