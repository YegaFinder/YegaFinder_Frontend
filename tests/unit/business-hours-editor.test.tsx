import { describe, it, expect, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BusinessHoursEditor } from "@/features/profile/components/BusinessHoursEditor";

function getMondayCard() {
  const heading = screen.getByText("Monday");
  return heading.closest("div")!.parentElement as HTMLElement;
}

describe("BusinessHoursEditor", () => {
  it("defaults every day to Closed, with no time inputs shown", () => {
    render(<BusinessHoursEditor onSubmit={vi.fn()} isSaving={false} />);
    const monday = getMondayCard();

    expect(within(monday).getByRole("switch", { name: /closed/i })).toHaveAttribute("aria-checked", "true");
    expect(within(monday).queryByLabelText(/opens/i)).not.toBeInTheDocument();
  });

  it("shows and requires open/close time once a day is switched to open", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<BusinessHoursEditor onSubmit={onSubmit} isSaving={false} />);

    const monday = getMondayCard();
    await user.click(within(monday).getByRole("switch", { name: /closed/i })); // turn Closed OFF

    expect(within(monday).getByLabelText(/opens/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /save business hours/i }));

    expect(await within(monday).findByText(/open time is required for monday/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects overnight hours the backend can't support (close not after open)", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<BusinessHoursEditor onSubmit={onSubmit} isSaving={false} />);

    const monday = getMondayCard();
    await user.click(within(monday).getByRole("switch", { name: /closed/i }));

    fireEvent.change(within(monday).getByLabelText(/opens/i), { target: { value: "22:00" } });
    fireEvent.change(within(monday).getByLabelText(/closes/i), { target: { value: "02:00" } });

    await user.click(screen.getByRole("button", { name: /save business hours/i }));

    expect(
      await within(monday).findByText(/close time must be after open time for monday/i),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("hides time inputs when a day is marked Open 24 hours", async () => {
    const user = userEvent.setup();
    render(<BusinessHoursEditor onSubmit={vi.fn()} isSaving={false} />);

    const monday = getMondayCard();
    await user.click(within(monday).getByRole("switch", { name: /closed/i })); // open Monday first
    await user.click(within(monday).getByRole("switch", { name: /24 hours/i }));

    expect(within(monday).queryByLabelText(/opens/i)).not.toBeInTheDocument();
  });

  it("disables everything when disabled=true (no profile created yet)", () => {
    render(<BusinessHoursEditor onSubmit={vi.fn()} isSaving={false} disabled />);
    const monday = getMondayCard();

    expect(within(monday).getByRole("switch", { name: /closed/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /save business hours/i })).toBeDisabled();
  });
});