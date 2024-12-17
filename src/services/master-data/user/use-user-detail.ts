import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import {  User } from "./types";

async function fetchUserById(userId: number) {
    const { data } = await http<{data : User}>(
      `users/${userId}`,
    );
  
    return data;
  }
  
  export function useUserById(userId: number) {
    const data = useQuery(
      ['user-items', userId],
      () => fetchUserById(userId),
      {
        enabled: userId !== undefined,
      }
    );
  
    return data;
  }