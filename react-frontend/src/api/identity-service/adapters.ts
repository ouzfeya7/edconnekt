import type { StandardListResponse, StandardSingleResponse } from './api';

/**
 * Safely unwrap a StandardListResponse to a typed array
 */
export function unwrapList<T = unknown>(res: StandardListResponse | undefined | null): T[] {
  const data = (res as { data?: unknown } | undefined | null)?.data;
  return Array.isArray(data) ? (data as T[]) : [];
}

/**
 * Safely unwrap a StandardSingleResponse to a typed value
 */
export function unwrapSingle<T = unknown>(res: StandardSingleResponse | undefined | null): T | undefined {
  if (!res) return undefined;
  const data = (res as { data?: unknown }).data;
  return data as T | undefined;
}
