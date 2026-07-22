import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type {
  CustomerProfile,
  CreateCustomerProfileRequest,
  UpdateCustomerProfileRequest,
} from "../types/profile.types";


export const profileApi = {
  getProfile: async (): Promise<CustomerProfile> => {
    const { data } = await apiClient.get<ApiEnvelope<CustomerProfile>>("/profiles/customer");
    return data.data;
  },

  createProfile: async (payload: CreateCustomerProfileRequest): Promise<CustomerProfile> => {
    const { data } = await apiClient.post<ApiEnvelope<CustomerProfile>>("/profiles/customer", payload);
    return data.data;
  },

  updateProfile: async (payload: UpdateCustomerProfileRequest): Promise<CustomerProfile> => {
    const { data } = await apiClient.put<ApiEnvelope<CustomerProfile>>("/profiles/customer", payload);
    return data.data;
  },
};