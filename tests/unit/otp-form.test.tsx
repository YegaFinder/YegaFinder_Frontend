import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

import { OtpForm } from "@/features/auth/components/OtpForm";
import { useAuthStore } from "@/store/auth-store";

// This test suite is a regression test for a bug where the OTP input field
// was accepting full-width digits (U+FF10–U+FF19) and passing them to the
// backend, which rejected them as invalid. The input should only accept
// ASCII digits (0-9).
describe("OtpForm — non-ASCII digit sanitization", () => {
  beforeEach(() => {
    useAuthStore.setState({
      pendingVerificationEmail: "test@example.com",
      user: null,
      isAuthenticated: false,
    });
  });

  it("strips full-width digits, accepting only ASCII 0-9", async () => {
    const user = userEvent.setup();
    render(<OtpForm />);

    const input = await screen.findByLabelText(/verification code/i);
    // U+FF11–FF16 = full-width "123456"
    await user.type(input, "１２３４５６");

    expect((input as HTMLInputElement).value).toBe("");
  });

  it("accepts real ASCII digits", async () => {
    const user = userEvent.setup();
    render(<OtpForm />);

    const input = await screen.findByLabelText(/verification code/i);
    await user.type(input, "123456");

    expect((input as HTMLInputElement).value).toBe("123456");
  });
});