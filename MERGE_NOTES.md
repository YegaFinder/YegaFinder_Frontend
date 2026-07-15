# Person A (customer-side auth) — merge notes

This branch was assembled by taking your **current `main`** as the source of
truth for every file that already existed there, and layering in the
customer-side auth work on top. Nothing on `main` was rewritten wholesale —
where a file existed on both sides, `main`'s version won unless a specific,
documented reason forced a change (see "3 real inconsistencies," below).
Delete this file before merging — it's context for review, not part of the
app.

## What's untouched from `main` (58 files)

Every file that already existed on `main` — configs (`tsconfig.json`,
`next.config.ts`, `package.json`, `vitest.config.ts`, `playwright.config.ts`,
`components.json`, `.env.example`, `eslint.config.mjs`), the whole
`(auth)`/`(customer)`/`(merchant)` page shell, `ui/*`, `shared/*` (except
`app-header.tsx`, see below), `constants/routes.ts`, `config/site.ts`,
`features/auth/{hooks,schemas,types}` for forgot-password/login/register/
reset-password, `store/auth-store.ts`, `types/api.types.ts`, and the test
suite — is byte-for-byte what you pasted from `main`, with **one exception**:
`package.json` gets one new line (see below). Everything else in this
category is untouched.

## What's new (Person A's actual contribution — 14 files)

These didn't exist on `main` at all:

- `src/middleware.ts` — route protection + soft role-based redirects
- `src/lib/api-client.ts` — axios instance, auth header injection, single-flight refresh-on-401
- `src/lib/auth-storage.ts` — localStorage + cookie mirror (see fix #1 below)
- `src/features/auth/api/auth.api.ts` — every auth HTTP call in one place
- `src/features/auth/components/{LoginForm,OtpForm,RegisterForm,ResetPasswordForm}.tsx`
- `src/features/auth/hooks/useOtp.ts` — verify + resend
- `src/components/shared/app-header.tsx`
- `src/components/shared/image-upload-field.tsx`
- `src/app/globals.css`, `src/app/layout.tsx` (root layout)
- `scripts/verify-env.mjs` — the real deploy-time env gate (see fix #2)

**Reconstructed, not verbatim** — flagged because their real source was
never available to work from, so these are best-effort rebuilds matching the
patterns of the forms that *were* available (RegisterForm,
ForgotPasswordForm):

- `LoginForm.tsx`, `ResetPasswordForm.tsx`
- `app-header.tsx`
- `globals.css` (design tokens like `yegna-primary` — swap in the real
  palette if it differs from what's here)

**Diff these four against whatever actually exists in your repo before
merging** — if a real version already exists, keep that one.

## 3 real inconsistencies found between `main` and Person A's branch — and what was done about each

Everything else that differed between the two was cosmetic (comments,
JSON formatting) and was left as `main` had it. These three were actual
bugs or contract mismatches:

### 1. `setTokens()` was missing its third argument

`main`'s `auth-store.ts` already called
`setTokens(accessToken, refreshToken, user?.role)` — but the new
`auth-storage.ts` only accepted two params, silently dropping the role.
Meanwhile `middleware.ts` reads a `user_role` cookie for its soft
role-based redirects, which nothing was ever setting. Net effect: the
role-redirect logic in middleware.ts was dead code.

**Fixed:** `auth-storage.ts`'s `setTokens` now takes an optional `role`
param and mirrors it into a `user_role` cookie; `removeTokens()` clears it
on logout. `api-client.ts`'s silent-refresh call still omits the role
argument on purpose — a token refresh doesn't have a new role to report,
and omitting it leaves the existing cookie alone instead of wiping it.

### 2. `env.ts`: kept the version that *doesn't* throw during `next build`

`main`'s `env.ts` throws on an invalid/missing `NEXT_PUBLIC_API_URL`
outside of `dev`/`test`. That's the version that broke plain
`npm run build` — Next prerenders pages at build time with
`NODE_ENV=production` and no `.env` file present on a fresh checkout, so
every CI build (even ones never deploying anywhere real) failed.

This is the **one deliberate exception** to "keep `main`'s file": I used
Person A's warn-and-fallback version instead, paired with the new
`scripts/verify-env.mjs`, which is the actual deploy-time gate now (see
`predeploy` in `package.json`). I did not silently keep `main`'s version
here, because doing so would have reintroduced a proven build breakage —
flagging it instead so you can make the call explicitly if you'd rather
handle it differently.

Verified directly: `npm run build` succeeds with *no* `.env.local` at all;
`npm run predeploy` (`verify-env.mjs`) correctly **fails** on a missing or
`localhost` URL and **passes** on a real one — see the "how to verify"
section below to reproduce.

### 3. `scripts/verify-env.mjs` existed but was never wired up

New file, but nothing called it. Added one line to `package.json`:
```json
"predeploy": "node scripts/verify-env.mjs"
```
That's the only change to `package.json` beyond adding this branch's files.

## Known gap, not fixed here

`authApi.resendVerification` in `auth.api.ts` guesses the endpoint as
`POST /auth/resend-verification`. Flagged in that file's own comment —
confirm the real route with whoever owns the backend before wiring the
"Resend code" button live.

## How this was verified (all green, reproduce with the commands below)

```bash
npm install
npx tsc --noEmit          # clean
npm run lint               # clean
npm run test                # 2/2 passing (OTP full-width-digit regression test)
npm run build                # clean, succeeds even with NO .env.local present
npm run predeploy            # fails without a real NEXT_PUBLIC_API_URL, passes with one
```

## Files intentionally *not* included

Build/generated artifacts aren't part of a real diff and were stripped
before packaging: `node_modules/`, `.next/`, `next-env.d.ts`,
`tsconfig.tsbuildinfo`, `package-lock.json` (let your own `npm install`
regenerate it against your repo's actual lockfile state), `public/sw.js`
(Serwist regenerates this at build time from `src/app/sw.ts`).
