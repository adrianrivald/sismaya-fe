import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import {  User } from "./types";

async function fetchCompanyByUserId(userId: number) {
    const { data } = await http<{data : User}>(
      `user-company/${userId}`,
    );
  
    return data;
  }
  
  export function useCompanyByUserId(userId: number) {
    const data = useQuery(
      ['user-company', userId],
      () => fetchCompanyByUserId(userId),
      {
        enabled: userId !== undefined,
      }
    );
  
    return data;
  }