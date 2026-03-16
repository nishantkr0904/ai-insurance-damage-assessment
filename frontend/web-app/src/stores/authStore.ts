import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    sessionStorage.setItem('auth_token', token);
    set({ user, token, isAuthenticated: true });
  },
  clearAuth: () => {
    sessionStorage.removeItem('auth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
