import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import type { RequestDetail, Assignees } from './types';

async function fetchRequestByID(requestId: string) {
  const { data } = await http<{ data: RequestDetail }>(`requests/${requestId}`);

  return data;
}

async function fetchRequestAssigneeByID(requestId: string) {
  const { data } = await http<{ data: RequestDetail }>(`requests/${requestId}/assignee`);

  return data;
}

export function useRequestAssigneeById(requestId: string, options: any = {}) {
  const data = useQuery(
    ['request-items-assignee', requestId],
    () => fetchRequestAssigneeByID(requestId),
    {
      enabled: requestId !== undefined,
      ...options,
    }
  );

  return data;
}

export function useRequestById(requestId: string, options: any = {}) {
  const data = useQuery(['request-items', requestId], () => fetchRequestByID(requestId), {
    enabled: requestId !== undefined,
    ...options,
  });

  return data;
}

export function useRequestAssignees(requestId: string) {
  return useRequestAssigneeById(requestId, {
    staleTime: Infinity,
    // @ts-ignore
    select: (data) => {
      const assignees = data?.assignees ?? [];

      if (assignees.length === 0) return [];

      return assignees.map((val: Assignees) => ({
        id: val.assignee.id,
        userId: val.assignee.user_info?.id,
        name: val.assignee.user_info?.name,
        avatar: val.assignee.user_info?.profile_picture,
        assigneeId: val.id,
      }));
    },
  });
}
