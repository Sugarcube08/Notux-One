import Api from './ApiInterceptor';
import type { AxiosHeaders } from 'axios';

export type SortMode = "asc" | "desc" | "original" | null;

export type Payload = {
    skip?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: SortMode;
    [key: string]: any;
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

export type Body ={
    [key: string]: any;
}

export type ApiConfig = {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: Payload;
    body?: Body;
    headers?: Record<string, string> | AxiosHeaders;
    signal?: AbortSignal;
};

export const apiService = async (api: ApiConfig) => {
    const { url, method, data, body, headers, signal } = api;
    
    try {
        const requestConfig: any = {
            url,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            signal 
        };

        // Add params for GET requests, data for others
        if (method === 'GET') {
            requestConfig.params = data;
        } else if (body) {
            requestConfig.data = body;
        } else if (data) {
            requestConfig.data = data;
        }

        const response = await Api(requestConfig);
        
        if (import.meta.env.DEV) {
            console.log(`✅ [${method}] ${url}`);
        }
        
        return response.data;

    } catch (error) {
        console.error('API Service Error:', error);
        throw error;
    }
};
