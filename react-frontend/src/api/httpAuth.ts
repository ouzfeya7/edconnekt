import type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import keycloak from '../pages/authentification/keycloak';
import { clearActiveContext } from '../utils/contextStorage';

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = keycloak
      .updateToken(30)
      .then(() => {
        const newToken = keycloak.token ?? null;
        if (newToken) {
          sessionStorage.setItem('keycloak-token', newToken);
        }
        if (keycloak.refreshToken) {
          sessionStorage.setItem('keycloak-refresh-token', keycloak.refreshToken);
        }
        return newToken;
      })
      .catch((err) => {
        try {
          sessionStorage.removeItem('keycloak-token');
          sessionStorage.removeItem('keycloak-refresh-token');
          clearActiveContext();
        } catch {
          // ignore storage cleanup errors
        }
        try {
          const raw = ((import.meta as { env?: { VITE_POST_LOGOUT_REDIRECT_URI?: string } }).env?.VITE_POST_LOGOUT_REDIRECT_URI) || window.location.origin;
          const redirectUri = raw.replace(/\/+$/, ''); // remove trailing slash for exact match
          keycloak.logout({ redirectUri });
        } catch {
          // ignore logout errors
        }
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export function attachAuthRefresh(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error?.response?.status;
      const originalRequest = error?.config as (AxiosRequestConfig & { __isRetry?: boolean }) | undefined;

      if (status === 401 && originalRequest && !originalRequest.__isRetry) {
        originalRequest.__isRetry = true;
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers = originalRequest.headers ?? {};
            (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
          }
          return instance(originalRequest);
        } catch (refreshErr) {
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(error);
    }
  );
}
