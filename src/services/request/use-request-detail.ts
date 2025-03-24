import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import type { RequestDetail, Assignees } from './types';
import { fetchInternalProduct } from '../master-data/user';

async function fetchRequestByID(requestId: string) {
  const { data } = await http<{ data: RequestDetail }>(`requests/${requestId}`);

  return data;
}

async function fetchMyRequestByID(requestId: string) {
  const { data } = await http<{ data: RequestDetail }>(`my-requests/${requestId}`);

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
      enabled: requestId !== undefined && requestId !== '0',
      ...options,
    }
  );

  return data;
}

export function useRequestById(requestId: string, options: any = {}) {
  const data = useQuery(['request-items', requestId], () => fetchRequestByID(requestId), {
    enabled: requestId !== undefined && requestId !== '0',
    ...options,
  });

  return data;
}

export function useMyRequestById(requestId: string, options: any = {}) {
  const data = useQuery(['my-request-items', requestId], () => fetchMyRequestByID(requestId), {
    enabled: requestId !== undefined && requestId !== '0',
    ...options,
  });

  return data;
}

export function useRequestAssigneeProduct(productId: string, options: any = {}) {
  const data = useQuery(
    ['request-items-product', productId],
    () => fetchInternalProduct(productId),
    {
      enabled: productId !== undefined && productId !== '0',
      ...options,
    }
  );

  return data;
}

export function useRequestAssignees(requestId: string) {
  return useRequestAssigneeProduct(requestId, {
    staleTime: Infinity,

    // @ts-ignore
    select: (data) => {
      const assignees = data || [];

      if (assignees?.length === 0) return [];

      return assignees.map((val: any) => ({
        id: val?.id,
        userId: val?.user_info?.id,
        name: val?.user_info?.name,
        avatar: val?.user_info?.profile_picture,
        assigneeId: val?.id,
      }));
    },
  });
}
