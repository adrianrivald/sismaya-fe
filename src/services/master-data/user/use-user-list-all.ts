import { useQuery } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import { User } from './types';

async function fetchUsers(type: string, internalId?: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/users', baseUrl);

  if (type) {
    endpointUrl.searchParams.append('type', type);
  }

  if (internalId) {
    endpointUrl.searchParams.append('internal_company', internalId);
  }

  const { data } = await http<{ data: User[] }>(endpointUrl.toString().replace(baseUrl, ''));

  return data;
}

export function useUsers(type: string, internalId?: string) {
  const data = useQuery(['user-items-all'], () => fetchUsers(type, internalId));

  return data;
}

async function fetchClientUsers(internalId?: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/users-client', baseUrl);

  if (internalId) {
    endpointUrl.searchParams.append('internal_company', internalId);
  }

  const { data } = await http<{ data: User[] }>(endpointUrl.toString().replace(baseUrl, ''));

  return data;
}

export function useClientUsers(internalId?: string) {
  const data = useQuery(['client-user-items-all'], () => fetchClientUsers(internalId));

  return data;
}

async function fetchInternalUsers(internalId?: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/users-internal', baseUrl);

  if (internalId) {
    endpointUrl.searchParams.append('internal_company', internalId);
  }

  const { data } = await http<{ data: User[] }>(endpointUrl.toString().replace(baseUrl, ''));

  return data;
}

export function useInternalUsers(internalId?: string) {
  const data = useQuery(['internal-user-items-all'], () => fetchInternalUsers(internalId));

  return data;
}

async function fetchInternalProduct(internalId?: string) {
  const baseUrl = window.location.origin;
  const endpointUrl = new URL('/users-internal', baseUrl);

  if (internalId) {
    endpointUrl.searchParams.append('product', internalId);
  }

  const { data } = await http<{ data: User[] }>(endpointUrl.toString().replace(baseUrl, ''));

  return data;
}

export function useInternalProduct(internalId?: string) {
  const data = useQuery(['internal-product-items-all'], () => fetchInternalProduct(internalId));

  return data;
}
