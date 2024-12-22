import { useQuery } from "@tanstack/react-query";
import { http } from "src/utils/http";
import {   UserCompany } from "./types";

async function fetchUserCompanyById(userId: number) {
    const { data } = await http<{data : UserCompany}>(
      `user-company/${userId}`,
    );
  
    return data;
  }
  
  export function useUserCompanyById(userId: number) {
    const data = useQuery(
      ['user-company', userId],
      () => fetchUserCompanyById(userId),
      {
        enabled: userId !== undefined,
      }
    );
  
    return data;
  }