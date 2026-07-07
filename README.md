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

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
shadcn/ui (Radix primitives + CVA) · Zustand · Axios · Zod + React Hook
Form · Serwist (PWA / service worker).

## Fixes applied in this build (see CHANGES.md)

- Corrected `NEXT_PUBLIC_API_URL` to include the backend's `/api/v1` global prefix.
- Added missing `useRegister` / `useOtp` hooks and `register` / `otp` Zod schemas.
- Corrected `authApi.register` / `authApi.verifyOtp` return types (backend returns
  no tokens for these — user must log in separately after verifying).
- Wired `RegisterForm` / `OtpForm` into their pages (previously TODO placeholders).
- Fixed `authApi.logout` to send the required `refreshToken` body and to clear
  local session state.
