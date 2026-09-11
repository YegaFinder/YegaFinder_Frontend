import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { useBookingDecision } from "@/features/merchant-bookings/hooks/useBookingDecision";
import { useMerchantBookings } from "@/features/merchant-bookings/hooks/useMerchantBookings";
import { merchantBookingsApi } from "@/features/merchant-bookings/api/merchant-bookings.api";
import type { MerchantBooking } from "@/features/merchant-bookings/types/merchant-booking.types";
import type { PaginatedResponse } from "@/types/api.types";

vi.mock("@/features/merchant-bookings/api/merchant-bookings.api", () => ({
  merchantBookingsApi: {
    getMyBookings: vi.fn(),
    decideBooking: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const booking: MerchantBooking = {
  id: "b1",
  listingId: "l1",
  listingTitle: "Weekend Brunch Menu",
  customerName: "Abebe Kebede",
  requestedAt: "2026-09-15T10:00:00.000Z",
  status: "pending",
  createdAt: "2026-09-10T00:00:00.000Z",
};

const page: PaginatedResponse<MerchantBooking> = {
  success: true,
  data: [booking],
  meta: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 },
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

describe("useBookingDecision", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(merchantBookingsApi.getMyBookings).mockResolvedValue(page);
  });

  it("optimistically flips the booking's status before the request resolves", async () => {
    // Never resolves during this test — lets us inspect the optimistic
    // state before the real mutation would have settled.
    vi.mocked(merchantBookingsApi.decideBooking).mockImplementation(() => new Promise(() => {}));

    const wrapper = createWrapper();
    const { result: listResult } = renderHook(() => useMerchantBookings(), { wrapper });
    await waitFor(() => expect(listResult.current.bookings).toHaveLength(1));

    const { result: decisionResult } = renderHook(() => useBookingDecision(), { wrapper });

    act(() => {
      decisionResult.current.mutate({ id: "b1", decision: "confirmed" });
    });

    await waitFor(() => expect(listResult.current.bookings[0].status).toBe("confirmed"));
  });

  it("rolls back to the original status if the request fails", async () => {
    vi.mocked(merchantBookingsApi.decideBooking).mockRejectedValue(new Error("network error"));

    const wrapper = createWrapper();
    const { result: listResult } = renderHook(() => useMerchantBookings(), { wrapper });
    await waitFor(() => expect(listResult.current.bookings).toHaveLength(1));

    const { result: decisionResult } = renderHook(() => useBookingDecision(), { wrapper });

    await act(async () => {
      await decisionResult.current.mutateAsync({ id: "b1", decision: "confirmed" }).catch(() => {});
    });

    // Rolled back to "pending", not left stuck on the optimistic "confirmed".
    await waitFor(() => expect(listResult.current.bookings[0].status).toBe("pending"));
  });
});