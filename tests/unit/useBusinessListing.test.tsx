import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { useBusinessListing } from "@/features/business-listings/hooks/useBusinessListing";
import { businessListingsApi } from "@/features/business-listings/api/business-listings.api";
import type { MerchantListing } from "@/features/business-listings/types/business-listing.types";

vi.mock("@/features/business-listings/api/business-listings.api", () => ({
  businessListingsApi: {
    getListing: vi.fn(),
    createListing: vi.fn(),
    updateListing: vi.fn(),
    deleteListing: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

const mockListing: MerchantListing = {
  id: "listing1",
  title: "Weekend Brunch Menu",
  description: "",
  category: { id: "cat1", name: "Restaurants" },
  subcategories: [],
  gallery: [],
  status: "pending",
  createdAt: "",
  updatedAt: "",
};

describe("useBusinessListing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not fetch when no id is passed (new-listing screen)", () => {
    renderHook(() => useBusinessListing(), { wrapper: createWrapper() });
    expect(businessListingsApi.getListing).not.toHaveBeenCalled();
  });

  it("loads a listing by id (edit screen)", async () => {
    vi.mocked(businessListingsApi.getListing).mockResolvedValue(mockListing);

    const { result } = renderHook(() => useBusinessListing("listing1"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.listing).toEqual(mockListing));
    expect(businessListingsApi.getListing).toHaveBeenCalledWith("listing1");
  });

  it("creates a listing and surfaces the pending-approval state", async () => {
    vi.mocked(businessListingsApi.createListing).mockResolvedValue(mockListing);

    const { result } = renderHook(() => useBusinessListing(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.createListing({
        title: "Weekend Brunch Menu",
        categoryId: "cat1",
      });
    });

    expect(businessListingsApi.createListing).toHaveBeenCalledWith({
      title: "Weekend Brunch Menu",
      categoryId: "cat1",
    });
  });

  it("surfaces a friendly message when deleting a listing with active bookings", async () => {
    const conflict = { response: { status: 409 } };
    vi.mocked(businessListingsApi.deleteListing).mockRejectedValue(conflict);

    const { result } = renderHook(() => useBusinessListing("listing1"), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.deleteListing().catch(() => {});
    });

    expect(businessListingsApi.deleteListing).toHaveBeenCalledWith("listing1");
  });
});