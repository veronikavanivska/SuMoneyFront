import { apiRequest } from "./api";
import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest
} from "./types";

export const authApi = {
  register(request: RegisterRequest) {
    return apiRequest<string>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(request),
      skipAuth: true
    });
  },

  login(request: LoginRequest) {
    return apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(request),
      skipAuth: true
    });
  },

  logout(refreshToken: string | null) {
    return apiRequest<string>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
      skipAuth: true
    });
  },

  changePassword(request: ChangePasswordRequest) {
    return apiRequest<string>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(request)
    });
  }
};
