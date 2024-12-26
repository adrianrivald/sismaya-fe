import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import {  User } from "./types";

async function fetchUsers(type : string) {
    const { data } = await http<{data : User[]}>(
      type === "internal" ? `users?type=internal` : `users?type=client`,
    );
  
    return data;
  }

  export function useUsers(type: string) {
    const data = useQuery(
      ['user-items-all'],
      () => fetchUsers(type)
    );
  
    return data;
  }
