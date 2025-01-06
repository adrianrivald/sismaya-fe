import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Role } from "./types";

export function useRole() {
  return useQuery(['role'], async () => {
    const { data: response } = await http<{ data: Role[] }>(
      'roles'
    );

    return response;
  });
}