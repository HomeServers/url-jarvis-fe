import { create } from 'zustand';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/lib/auth';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  hydrate: () => void;
  login: (accessToken: string, refreshToken: string) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isHydrated: false,

  hydrate: () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    set({ accessToken, refreshToken, isHydrated: true });
  },

  login: (accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken });
  },

  updateTokens: (accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken });
  },

  logout: () => {
    clearTokens();
    set({ accessToken: null, refreshToken: null });
  },
}));
