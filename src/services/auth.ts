import api from "./api"
import type { LoginCredentials, AuthResponse, User } from "../types"

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post("/auth/token/", credentials);
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    return response.data;
  },

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem("refresh_token")
    const response = await api.post("/auth/refresh/", {
      refresh: refreshToken,
    })
    return response.data.access
  },
}
