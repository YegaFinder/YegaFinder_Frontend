import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";

export interface StaffMember {
  id: string;
  businessId: string;
  userId: string;
  role: string;
  user: { id: string; firstName: string; lastName: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffRequest {
  userId: string;
  role: string;
}

export const staffApi = {
  /** Backend: GET /merchant/staff — bare array, no unwrapping needed beyond data.data */
  list: async (): Promise<StaffMember[]> => {
    const { data } = await apiClient.get<ApiEnvelope<StaffMember[]>>("/merchant/staff");
    return data.data;
  },

  /**
   * Backend: POST /merchant/staff
   * ⚠️ No DTO validation on this endpoint (BACKEND_API_GUIDE.md §9.2) —
   * `userId` isn't checked to be a real user before insertion. A bad id
   * can surface as an opaque 500 instead of a clean 400.
   */
  create: async (payload: CreateStaffRequest): Promise<StaffMember> => {
    const { data } = await apiClient.post<ApiEnvelope<StaffMember>>("/merchant/staff", payload);
    return data.data;
  },

  /** Backend: DELETE /merchant/staff/:id — scoped to caller's own business, always 200 */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/merchant/staff/${id}`);
  },
};