import { create } from "zustand";
import { authService } from "../services/auth";
import { User, LoginCredentials } from "../types";
import toast from "react-hot-toast";
import { api } from "../services/api";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      await authService.login(credentials);
      await useAuthStore.getState().getCurrentUser(); // Fetch user after successful login
      set({ isAuthenticated: true, isLoading: false });
      toast.success("Login successful!");
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || "Login failed";
      set({ error: message, isLoading: false, isAuthenticated: false, user: null });
      toast.error(message);
      throw err; // Re-throw to allow component to handle
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ isAuthenticated: false, user: null });
    toast.success("Logged out successfully!");
  },

  getCurrentUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<User>("/me/");
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || "Failed to fetch user data";
      set({ error: message, isLoading: false, isAuthenticated: false, user: null });
      // If 401, it means token is invalid, so clear tokens and redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
      toast.error(message);
      throw err; // Re-throw to allow component to handle
    }
  },
}));
