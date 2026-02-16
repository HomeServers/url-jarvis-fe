import { API_BASE_URL, TOKEN_REFRESH_BUFFER } from './constants';
import { getAccessToken, getRefreshToken, isTokenExpired } from './auth';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiResponse } from '@/types/api';
import type { AuthTokens } from '@/types/auth';

let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    useAuthStore.getState().logout();
    throw new Error('No refresh token');
  }

  const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    useAuthStore.getState().logout();
    throw new Error('Token refresh failed');
  }

  const json: ApiResponse<AuthTokens> = await res.json();
  if (json.success && json.data) {
    useAuthStore.getState().updateTokens(json.data.accessToken, json.data.refreshToken);
  } else {
    useAuthStore.getState().logout();
    throw new Error('Token refresh failed');
  }
}

async function ensureValidToken(): Promise<string | null> {
  const token = getAccessToken();
  if (!token) return null;

  if (isTokenExpired(token, TOKEN_REFRESH_BUFFER)) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    await refreshPromise;
    return getAccessToken();
  }

  return token;
}

interface FetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

export async function apiClient<T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const token = await ensureValidToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // 204 No Content
  if (res.status === 204) {
    return { success: true, data: null as T };
  }

  // 401 → 강제 로그아웃
  if (res.status === 401) {
    useAuthStore.getState().logout();
    throw new Error('Unauthorized');
  }

  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    throw new Error(json.error ?? '요청에 실패했습니다.');
  }

  return json;
}
