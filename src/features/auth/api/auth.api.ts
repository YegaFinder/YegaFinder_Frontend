import { apiClient } from "@/lib/api-client";
import { AuthResponse } from "../types/auth.types";

export const authApi = {
  login: async (data: any): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },
  
  register: async (data: any): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },
  
  verifyOtp: async (data: { email: string; otp: string }): Promise<any> => {
    const response = await apiClient.post("/auth/verify-otp", data);
    return response.data;
  },
  
  forgotPassword: async (data: { email: string }): Promise<any> => {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response.data;
  },
  
  getMe: async (): Promise<any> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  }
};
