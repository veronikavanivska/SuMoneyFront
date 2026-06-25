import { create } from "zustand";
import { storageKeys } from "../constants/storage";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  authReady: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string | null) => void;
  setAuthReady: (ready: boolean) => void;
  clearAuth: () => void;
};

const initialAccessToken = localStorage.getItem(storageKeys.accessToken);
const initialRefreshToken = localStorage.getItem(storageKeys.refreshToken);

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  authReady: true,

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(storageKeys.accessToken, accessToken);
    localStorage.setItem(storageKeys.refreshToken, refreshToken);
    set({ accessToken, refreshToken, authReady: true });
  },

  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem(storageKeys.accessToken, token);
    } else {
      localStorage.removeItem(storageKeys.accessToken);
    }

    set({ accessToken: token });
  },

  setAuthReady: (ready) => set({ authReady: ready }),

  clearAuth: () => {
    localStorage.removeItem(storageKeys.accessToken);
    localStorage.removeItem(storageKeys.refreshToken);
    set({ accessToken: null, refreshToken: null, authReady: true });
  }
}));
