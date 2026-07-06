# bookings (later phase)

Planned structure, mirroring `features/auth/`. Covers the booking &
reservation system per the SRS section 3.6 — appointment scheduling,
availability, confirmations. This is also where the "always-fresh,
no-store" fetch pattern matters most (see team README's caching notes),
since stale availability data can cause a double-booking.
