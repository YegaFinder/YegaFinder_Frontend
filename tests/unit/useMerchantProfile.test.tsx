import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { useMerchantProfile } from "@/features/profile/hooks/useMerchantProfile";
import { merchantProfileApi } from "@/features/profile/api/merchant-profile.api";
import type { MerchantProfile } from "@/features/profile/types/profile.types";

vi.mock("@/features/profile/api/merchant-profile.api", () => ({
  merchantProfileApi: {
    getProfile: vi.fn(),
    createProfile: vi.fn(),
    updateProfile: vi.fn(),
    updateBusinessHours: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockProfile: MerchantProfile = {
  id: "mp1",
  businessName: "Blue Nile Coffee",
  businessCategories: [],
  socialMedia: {},
  servicesOffered: [],
  businessHours: [],
  verificationStatus: "pending",
  averageRating: 0,
  totalReviews: 0,
  isFeatured: false,
  isProfileComplete: false,
  createdAt: "",
  updatedAt: "",
  user: {} as never,
};

describe("useMerchantProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads the merchant profile", async () => {
    vi.mocked(merchantProfileApi.getProfile).mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useMerchantProfile(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.profile?.businessName).toBe("Blue Nile Coffee");
    expect(result.current.profileNotCreatedYet).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("treats a 404 as 'profile not created yet', not an error", async () => {
    const notFound = Object.assign(new Error("Not Found"), {
      isAxiosError: true,
      response: { status: 404 },
    });
    vi.mocked(merchantProfileApi.getProfile).mockRejectedValue(notFound);

    const { result } = renderHook(() => useMerchantProfile(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.profileNotCreatedYet).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.profile).toBeUndefined();
  });

  it("surfaces a real fetch error (non-404) as isError", async () => {
    const serverError = Object.assign(new Error("Server error"), {
      isAxiosError: true,
      response: { status: 500 },
    });
    vi.mocked(merchantProfileApi.getProfile).mockRejectedValue(serverError);

    const { result } = renderHook(() => useMerchantProfile(), { wrapper: createWrapper() });

    // The hook retries once on non-404 errors before settling — TanStack
    // Query's default retry delay (~1s) means this needs more headroom
    // than waitFor's default 1000ms timeout.
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 });

    expect(result.current.isError).toBe(true);
    expect(result.current.profileNotCreatedYet).toBe(false);
  });

  it("updates the cache and uses the shared query key after a successful update", async () => {
    // Model a real backend: the mock actually persists the change, so
    // the invalidate-triggered refetch after the mutation reflects it
    // instead of overwriting the update with stale data.
    let currentProfile: MerchantProfile = mockProfile;
    vi.mocked(merchantProfileApi.getProfile).mockImplementation(() => Promise.resolve(currentProfile));
    vi.mocked(merchantProfileApi.updateProfile).mockImplementation(async () => {
      currentProfile = { ...currentProfile, businessName: "Updated Name" };
      return currentProfile;
    });

    const { result } = renderHook(() => useMerchantProfile(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await result.current.updateProfile({ businessName: "Updated Name" });

    await waitFor(() => expect(result.current.profile?.businessName).toBe("Updated Name"));
    expect(merchantProfileApi.updateProfile).toHaveBeenCalledWith({ businessName: "Updated Name" });
  });
});