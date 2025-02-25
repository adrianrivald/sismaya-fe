import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";

async function fetchPermissions() {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/user-permissions', baseUrl);


  const { data } = await http<{data: string[]}>(
    endpointUrl.toString().replace(baseUrl, '')
  )

  return data
  }

  export function useUserPermissions() {
    const data = useQuery(
      ['user-permissions'],
      () => fetchPermissions()
    );
  
    return data;
  }
