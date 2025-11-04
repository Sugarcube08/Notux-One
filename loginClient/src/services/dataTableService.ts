import API from './ApiInterceptor';
import type { ApiConfig } from './ApiService';

export type SortMode = "asc" | "desc" | "original" | null;

export type Payload = {
  skip?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortMode;
  [key: string]: any;
};

export type Api = {
  url: string;
  method: "GET" | "POST";
  data?: Payload;
  headers?: Record<string, string>;
};

export type ResponseStruct = {
  limit?: string;
  skip?: string;
  total?: string;
  sortBy?: string;
  sortOrder?: string;
  searchParam?: string;
  searchRoute?: string;
};


// --- Helper functions ---
export const getNestedValue = (obj: any, path?: string): any =>
  path ? path.split('.').reduce((acc, key) => acc?.[key], obj) : undefined;

export const parseApiResponse = (columns: any[], apiResponse: any): any[] => {
  if (!apiResponse) return [];

  let dataSource: any[] = Array.isArray(apiResponse) ? apiResponse : [];

  if (!dataSource.length && typeof apiResponse === "object") {
    const possibleArrayKeys = Object.keys(apiResponse).filter(k => Array.isArray(apiResponse[k]));
    const key = possibleArrayKeys.includes("data") ? "data" : possibleArrayKeys[0];
    dataSource = apiResponse[key] || apiResponse.products || [apiResponse];
  }

  return dataSource.map(item =>
    Object.fromEntries(
      columns.map(col => [
        col.title,
        col.serial ? null : getNestedValue(item, col.dataIndex),
      ])
    )
  );
};

// --- Main service function ---
export async function fetchTableData({
  api,
  page,
  rowsPerPage,
  sortKey,
  sortMode,
  debouncedSearch,
  columns,
  responseStruct,
}: {
  api: ApiConfig;
  page?: number;
  rowsPerPage?: number;
  sortKey?: string | null;
  sortMode?: "asc" | "desc" | "original" | null;
  debouncedSearch?: string;
  columns?: any[];
  responseStruct?: ResponseStruct;
}) {
  const limitKey = responseStruct?.limit || 'limit';
  const skipKey = responseStruct?.skip || 'skip';
  const totalKey = responseStruct?.total || 'total';
  const skipAmount = (((page || 1) - 1) * (rowsPerPage || 0)) + (api?.data?.skip ?? 0);
  const params: Record<string, any> = {
    [limitKey.split('.').at(-1) as string]: rowsPerPage,
    [skipKey.split('.').at(-1) as string]: skipAmount,
    ...(sortKey && sortMode
      ? (responseStruct?.sortBy?.includes(".") && responseStruct?.sortOrder?.includes(".")) ? { 
        [responseStruct?.sortBy?.split('.').at(-1) as string]: sortKey,
        [responseStruct?.sortOrder?.split('.').at(-1) as string]: sortMode,
      } : {
        [responseStruct?.sortBy as string]: sortKey,
        [responseStruct?.sortOrder as string]: sortMode,
      }
      : {}),
  };

  let url = api.url;
  let options: RequestInit = {
    method: api.method,
    headers: { ...(api.headers || {}) },
  };

  if (debouncedSearch?.trim()) {
    if (responseStruct?.searchRoute) {
      url += responseStruct?.searchRoute;
    }
    if (responseStruct?.searchParam) {
      params[responseStruct.searchParam] = debouncedSearch;
    }
  }

  if (api.method === "GET") {
    const query = new URLSearchParams(
      Object.entries({ ...api.data, ...params })
        .reduce<Record<string, string>>((acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '' && value !== 0) acc[key] = String(value);
          return acc;
        }, {})
    ).toString();
    if (query) url += `?${query}`;

    const res = await API.
      request({
        url,
        method: api.method,
        headers: { ...(api.headers || {}) },
        data: { ...api.data, ...params },
      });
    const json = res.data;
    return {
      data: parseApiResponse(columns || [], json),
      total: getNestedValue(json, totalKey) || 0,
    };
  } else {
    options = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(api.headers || {}),
      },
      body: JSON.stringify({ ...api.data, ...params }),
    };

    const res = await API.
      request({
        url,
        method: api.method,
        headers: { ...(api.headers || {}) },
        data: { ...api.data, ...params },
      });
    const json = res.data;
    return {
      data: json,
    };
  }
}