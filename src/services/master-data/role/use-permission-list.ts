import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Permissions } from "./types";

async function fetchPermissions() {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/permissions', baseUrl);

  const { data } = await http<{data: Permissions[]}>(
    endpointUrl.toString().replace(baseUrl, '')
  )

  return data
  }

  export function usePermissions() {
    const data = useQuery(
      ['permissions-all'],
      () => fetchPermissions()
    );
  
    return data;
  }
