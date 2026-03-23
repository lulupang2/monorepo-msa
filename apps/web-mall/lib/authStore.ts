import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  nickname?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoggedIn: false,
      setAuth: (user, token, refreshToken) =>
        set({ user, token, refreshToken, isLoggedIn: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, refreshToken: null, isLoggedIn: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
