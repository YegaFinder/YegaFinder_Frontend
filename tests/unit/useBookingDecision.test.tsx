import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { useBookingDecision } from "@/features/merchant-bookings/hooks/useBookingDecision";
import { useMerchantBookings } from "@/features/merchant-bookings/hooks/useMerchantBookings";
import { merchantBookingsApi } from "@/features/merchant-bookings/api/merchant-bookings.api";
import type { MerchantBooking } from "@/features/merchant-bookings/types/merchant-booking.types";

vi.mock("@/features/merchant-bookings/api/merchant-bookings.api", () => ({
  merchantBookingsApi: {
    getMerchantBookings: vi.fn(),
    decideBooking: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const booking: MerchantBooking = {
  id: "b1",
  customerId: "c1",
  businessId: "biz1",
  appointmentTime: "2026-09-15T10:00:00.000Z",
  notes: null,
  status: "PENDING",
  customer: { id: "c1", firstName: "Abebe", lastName: "Kebede", phone: null },
  createdAt: "2026-09-10T00:00:00.000Z",
  updatedAt: "2026-09-10T00:00:00.000Z",
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
    vi.mocked(merchantBookingsApi.getMerchantBookings).mockResolvedValue([booking]);
  });

  it("optimistically flips the booking's status before the request resolves", async () => {
    vi.mocked(merchantBookingsApi.decideBooking).mockImplementation(() => new Promise(() => {}));

    const wrapper = createWrapper();
    const { result: listResult } = renderHook(() => useMerchantBookings(), { wrapper });
    await waitFor(() => expect(listResult.current.bookings).toHaveLength(1));

    // Switch to "All" so an ACCEPTED booking doesn't just fall out of the
    // default PENDING-only view — we want to see the optimistic change.
    act(() => listResult.current.setStatusFilter(undefined));

    const { result: decisionResult } = renderHook(() => useBookingDecision(), { wrapper });

    act(() => {
      decisionResult.current.mutate({ id: "b1", decision: "accept" });
    });

    await waitFor(() => expect(listResult.current.bookings[0]?.status).toBe("ACCEPTED"));
  });

  it("rolls back to the original status if the request fails", async () => {
    vi.mocked(merchantBookingsApi.decideBooking).mockRejectedValue(new Error("network error"));

    const wrapper = createWrapper();
    const { result: listResult } = renderHook(() => useMerchantBookings(), { wrapper });
    await waitFor(() => expect(listResult.current.bookings).toHaveLength(1));

    const { result: decisionResult } = renderHook(() => useBookingDecision(), { wrapper });

    await act(async () => {
      await decisionResult.current.mutateAsync({ id: "b1", decision: "accept" }).catch(() => {});
    });

    await waitFor(() => expect(listResult.current.bookings[0]?.status).toBe("PENDING"));
  });
});