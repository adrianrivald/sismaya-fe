import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import {  User } from "./types";

async function fetchUsers(type : string, internalId?: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/users', baseUrl);

  
  if (type) {
    endpointUrl.searchParams.append('type', type);
  }

  if(internalId) {
    endpointUrl.searchParams.append('internal_company', internalId);

  }

  const { data } = await http<{data: User[]}>(
    endpointUrl.toString().replace(baseUrl, '')
  )

  return data
  }

  export function useUsers(type: string, internalId?: string) {
    const data = useQuery(
      ['user-items-all'],
      () => fetchUsers(type, internalId)
    );
  
    return data;
  }
