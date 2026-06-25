import { useAuthStore } from "../store/auth.store";
import type { AuthResponse } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8888";

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
  skipJsonContentType?: boolean;
};

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    useAuthStore.getState().clearAuth();
    return null;
  }

  const response = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refreshToken })
  });

  if (!response.ok) {
    useAuthStore.getState().clearAuth();
    return null;
  }

  const data = (await response.json()) as AuthResponse;
  useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);

  return data.accessToken;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!options.skipJsonContentType && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const accessToken = useAuthStore.getState().accessToken;

  if (!options.skipAuth && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 401 && !options.skipAuth) {
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      throw new Error("Unauthorized");
    }

    headers.set("Authorization", `Bearer ${newAccessToken}`);

    const retryResponse = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });

    return parseResponse<T>(retryResponse);
  }

  return parseResponse<T>(response);
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await response.json();
      throw new Error(body.message || body.error || `HTTP ${response.status}`);
    }

    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return response.text() as Promise<T>;
}

export async function apiBlob(path: string): Promise<Blob> {
  const accessToken = useAuthStore.getState().accessToken;

  const response = await fetch(`${API_URL}${path}`, {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`
        }
      : undefined
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.blob();
}
