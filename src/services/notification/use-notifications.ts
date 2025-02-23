import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "src/utils/http";
import { Notification } from "./types";

interface Meta {
  page: number;
  page_size: number;
  total_data: number;
  unread_count: number
}

async function fetchNotification(page: number) {
    const { data, meta } = await http<{data : Notification[], meta: Meta}>(
      `notifications?page=${page}`,
    );
  
    return {data, meta};
  }
  
  export function useNotifications(page: number) {
    const data = useQuery(
      ['notifications', page],
      () => fetchNotification(page)
    );
  
    return data;
  }

  
export function useReadNotification() {
  const queryClient = useQueryClient();
  return useMutation(
    async (formData: {id: number}) => {
      const { id } = formData
      
      return http(`notifications/mark-as-read/${id}`, {
        method: "POST"
      });
    },
    {
        onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);

      },
      onError: (error) => {
        const reason =
          error instanceof Error ? error.message : 'Something went wrong';

      },
    }
  );
}


export function useReadAllNotification() {
  const queryClient = useQueryClient();
  return useMutation(
    async () => http(`notifications/mark-as-read`, {
        method: "POST"
      }),
    {
        onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);

      },
      onError: (error) => {
        const reason =
          error instanceof Error ? error.message : 'Something went wrong';

      },
    }
  );
}
