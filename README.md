# YegnaFinder V2 — Frontend

Ethiopia's Smart Local Discovery & Marketplace Platform — Next.js frontend.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in NEXT_PUBLIC_API_URL
npm run dev
```

Visit `http://localhost:3000`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
shadcn/ui (Radix primitives + CVA) · Zustand · Axios · Zod + React Hook
Form · Serwist (PWA / service worker).

## Folder structure & why it's shaped this way

```
src/
├── app/                    # Routing & layouts ONLY — no business logic here
│   ├── (auth)/             # Route group: login, register, forgot-password, verify-otp
│   │   └── layout.tsx      # Shared split-screen shell for all auth pages
│   ├── layout.tsx          # Root layout — <html>/<body>, fonts, PWA manifest link
│   ├── page.tsx            # Landing page
│   ├── globals.css         # THE design system — brand colors, theme tokens, dark mode
│   └── sw.ts               # Service worker source (Serwist builds public/sw.js from this)
│
├── components/
│   ├── ui/                 # shadcn-generated primitives (Button, Input, Label, ...)
│   └── shared/              # Small hand-built components reused across features (Logo, Spinner, ...)
│
├── features/                # One folder per real-world feature/domain
│   └── auth/
│       ├── api/            # HTTP calls for this feature — the ONLY place that calls apiClient
│       ├── types/           # This feature's data contracts (shared between people working on it)
│       ├── schemas/         # Zod validation schemas, one per form
│       ├── hooks/           # Custom hooks wrapping api + store + navigation for this feature
│       └── components/      # This feature's actual UI (forms, cards, etc.)
│
├── lib/                     # Cross-cutting utilities with no feature ownership
│   ├── api-client.ts        # The one Axios instance, with interceptors, everything goes through
│   ├── auth-storage.ts       # Token read/write (localStorage + cookie)
│   └── utils.ts              # cn() class-merge helper
│
├── store/                    # Zustand — global state that many components need
│   └── auth-store.ts
│
├── constants/
│   └── routes.ts              # Every URL path as a named constant — never hardcode a path string
│
├── types/
│   └── api.types.ts           # Generic ApiResponse<T> / PaginatedResponse<T> wrappers
│
├── config/
│   └── site.ts                 # Site name/description/URL
│
└── middleware.ts               # Route protection — runs server-side before a protected page loads
```

**The dependency rule**, so this stays decoupled as the app grows past
Phase 1: `app/` depends on `features/`, `features/` depends on `lib/` and
`store/`, and `lib/`/`store/` depend on nothing feature-specific. Never
import from one feature into another feature directly (e.g. `businesses/`
should not import from `auth/` beyond the shared `types`/`store` — if two
features need to share logic, that logic belongs in `lib/`, not in either
feature folder).

**Adding a new feature later (Sprint 2/3+)** means copying this exact
shape — `features/profile/`, `features/businesses/`, and
`features/bookings/` already exist as empty scaffolds with a short README
in each, so the pattern is obvious when it's time to build them.

## Team split — Sprint 1 (Authentication & RBAC)

| Owner | Files |
|---|---|
| 🟡 Shared | Everything in this repo except the four files below — built already |
| 🔵 Person B | `app/(auth)/login/page.tsx`, `app/(auth)/forgot-password/page.tsx`, `features/auth/components/LoginForm.tsx`, `features/auth/components/ForgotPasswordForm.tsx`, `features/auth/schemas/login.schema.ts`, `features/auth/hooks/useLogin.ts` (+ forgot-password equivalents) |
| 🟢 Person A | `app/(auth)/register/page.tsx`, `app/(auth)/verify-otp/page.tsx`, `features/auth/components/RegisterForm.tsx`, `features/auth/components/OtpForm.tsx`, `features/auth/schemas/register.schema.ts`, `features/auth/hooks/useRegister.ts` (+ OTP equivalents) |

Every page under `app/(auth)/` currently has a placeholder marked with a
`TODO(Person A/B)` comment — replace the placeholder with the real form
component once it's built. Because pages only ever import a component
(never contain form logic themselves), you and Person A can work in
parallel without ever touching the same file.

**Merge-conflict risk lives in the 🟡 shared files** — `auth.api.ts`,
`auth.types.ts`, `auth-store.ts`, `api-client.ts`. These are considered
done for Sprint 1; if either of you needs to change one (e.g. add a new
type field), flag it to the other person / team lead first rather than
editing silently.

## Why localStorage *and* a cookie for the token

`api-client.ts` (running in the browser) reads the token from
`localStorage`. `middleware.ts` (running on the server, for route
protection) can't see `localStorage` — it can only read cookies. So
`auth-storage.ts` writes the access token to both on login. The cookie is
not `httpOnly`, so treat it as a presence check only ("is someone logged
in at all"), not a secure boundary — real authorization still happens
against the backend on every API call.

## PWA

`public/manifest.json` and `src/app/sw.ts` are wired up via
`@serwist/next` in `next.config.ts`. The service worker is disabled in
`next dev` (so hot-reload isn't fighting a cached worker) and only builds
in `npm run build` / `npm run start`. The icons in `public/icons/` are
placeholders — swap in real exported app icons (192×192, 512×512, plus a
512×512 "maskable" version with safe-zone padding) before shipping.

As live-data features land (booking availability in particular), revisit
the `runtimeCaching` strategy in `sw.ts` per-route — see the reasoning on
cache-first vs. network-first vs. stale-while-revalidate in the
project's internal architecture notes; showing a stale "available" slot
offline is a real bug, not just a minor inconvenience.

## Route protection

`src/middleware.ts` currently checks only "is there a token cookie at
all" for routes matching `ROUTES.MERCHANT_DASHBOARD` and `ROUTES.PROFILE`.
Role-based checks (e.g. only `Merchant` may access
`/dashboard/listings`) are stubbed with a TODO — wire this in once the
JWT's role claim (or a mirrored role cookie) is available.
