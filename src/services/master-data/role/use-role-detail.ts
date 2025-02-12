import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import type {  Role } from "./types";

async function fetchRoleById(roleId: number) {
    const { data } = await http<{data : Role}>(
      `roles/${roleId}`,
    );
  
    return data;
  }
  
  export function useRoleById(roleId: number) {
    const data = useQuery(
      ['role-items', roleId],
      () => fetchRoleById(roleId),
      {
        enabled: roleId !== undefined,
      }
    );
  
    return data;
  }