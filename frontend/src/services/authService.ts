import { apiService } from "./api";
import { LoginCredentials, AuthResponse, User } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data!;
  },

  async logout(): Promise<void> {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    await apiService.post("/auth/logout");
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>("/auth/me");
    return response.data!;
  },

  getStoredUser(): User | null {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  },

  getStoredToken(): string | null {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  },

  isAdmin(): boolean {
    const user = this.getStoredUser();
    return user?.role === "admin";
  },
};
