# YegnaFinder Frontend Sprint Handoff

**Prepared:** 2026-09-07  
**Repository:** `yegnafinder-frontend`  
**Branch:** `feat/customer-profile`  
**HEAD:** `a74b1cd fix(customer-profile): correct /profile base path, fix favorites nested business shape`

## 1. Executive Summary

YegnaFinder is a Next.js 15 / React 19 Progressive Web App for Ethiopian local business discovery and marketplace workflows. This repository contains the frontend only; the NestJS backend is a separate project.

Authentication is implemented end to end at the frontend boundary: registration, email OTP verification, login, Google login API support, password reset, token refresh, logout, and role-aware routing. Customer profile, saved places, favorites UI, and a substantial merchant profile editor are also present.

The next major product gap is business discovery. The authenticated customer home page is still a placeholder, and business list/detail, booking, merchant listing management, and admin routes are declared but have no page implementations.

## 2. Current Repository State

- Working tree: `package-lock.json` has an uncommitted change. Preserve it until its origin is understood.
- Recent commits include customer profile reconciliation, live saved-place/favorites endpoint updates, geocoding, and merchant profile work.
- This is a frontend-only repository. Do not assume backend modules or response contracts exist because a frontend API wrapper exists.
- The older `YEGNAFINDER_OVERVIEW.md` is partly stale: it describes profile and merchant dashboard work as planned, while those surfaces now exist.

## 3. Stack and Runtime

- Next.js `15.5.20`, App Router, TypeScript 5, React `19.2.4`
- Tailwind CSS 4, shadcn/Radix primitives, CVA, `lucide-react`
- Zustand 5 for auth state and persistence
- Axios for HTTP, TanStack React Query for server state
- React Hook Form + Zod for forms and validation
- Serwist for PWA/service-worker support
- Vitest + Testing Library for unit tests; Playwright for E2E

Useful commands:

```bash
npm install
npm run dev
npm run lint
npm run test
npx tsc --noEmit
npm run build
npm run test:e2e
```

Playwright builds and starts the production app automatically. Set `PLAYWRIGHT_BASE_URL` to test an already-running app.

## 4. Routing and Pages

### Public/authentication

- `/` landing page
- `/login`
- `/register`
- `/verify-otp`
- `/forgot-password`
- `/reset-password`
- `/terms`
- `/privacy`

### Customer

- `/home`: authenticated customer landing page; currently a `Not implemented yet` placeholder
- `/profile`: customer profile, avatar upload, personal profile fields, notification preferences, completion status, loyalty points
- `/saved-places`: saved address CRUD with address geocoding confirmation
- `/favorites`: favorites list/removal UI; backend availability is still uncertain

### Merchant

- `/dashboard`: merchant dashboard placeholder with a link to profile
- `/dashboard/profile`: merchant profile editor with business details, contact, location, reach/social links, hours, compliance, gallery, videos, staff, promotions, subscription information, analytics, and verification UI

### Declared but not implemented

- `/businesses`
- `/businesses/:id`
- `/dashboard/bookings`
- `/dashboard/listings`
- `/admin`

Route constants live in `src/constants/routes.ts`. Add a page and tests when activating a declared route; do not leave navigation pointing at a missing route.

## 5. Authentication and Authorization

### Client storage

`src/lib/auth-storage.ts` stores access and refresh tokens in `localStorage`. It mirrors session presence into client-written cookies:

- `has_session`: presence signal for middleware
- `user_role`: UX routing signal

The cookies are not secure authorization sources. The backend must authorize every API request.

`src/store/auth-store.ts` persists only the user object through Zustand. Authentication is re-derived from the stored access token, while OTP and loading state are transient.

### Middleware

`src/middleware.ts`:

- Redirects unauthenticated users from protected routes to `/login?redirectTo=...`.
- Redirects authenticated users away from guest-only auth pages.
- Redirects merchants away from customer routes to `/dashboard`.
- Redirects customers away from merchant routes to `/home`.
- Handles customer/merchant routing only. Moderator and Admin roles exist in types but have no route guards or pages yet.

The middleware checks `has_session`, not access-token validity. Expired tokens are corrected when an API call receives a 401.

### Axios client

`src/lib/api-client.ts`:

- Adds the bearer access token to requests.
- On non-auth 401 responses, refreshes once through `/auth/refresh` and retries the request.
- Deduplicates concurrent refresh calls.
- Stores both rotated tokens.
- Logs out and redirects to `/login` if refresh fails.
- Leaves auth endpoint 401 responses alone so bad credentials/OTP do not trigger refresh.
- Surfaces 429 responses with a retry message.

Default API fallback is the production Railway API. Local development should set `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` in `.env.local`.

## 6. Feature Inventory

### Auth (`src/features/auth`)

- API: register, login, Google login, verify/resend OTP, forgot password, reset password, `/auth/me`, logout, logout-all
- Hooks: `useLogin`, `useRegister`, `useOtp`, `useForgotPassword`, `useResetPassword`
- Components: login, registration, OTP, forgot-password, reset-password forms
- Zod schemas for all auth forms
- Types include `User`, `Role`, and request/response contracts

### Customer profile (`src/features/profile`)

- Customer profile read/update
- Avatar upload integration through the existing image-upload hook
- Notification preference mutation
- Saved address read/create/delete
- Geocoding helper in `src/lib/geocode.ts`
- Shared feedback/toast and loading conventions

The customer profile contract follows the reconciled `CustomerProfile`/`SavedAddress` types. Customer name and phone are displayed from the auth user and are not editable by the current profile API.

### Favorites (`src/features/favorites`)

Current frontend API assumptions:

- `GET /favorites`
- `POST /favorites` with `{ businessId }`
- `DELETE /favorites/:businessId`

The UI can render a business list and remove favorites. The backend module/controller/entity was not confirmed in this repository context. Confirm the real paths and response envelope before building discovery integration.

### Merchant profile (`src/features/profile`)

The merchant profile surface includes:

- Business details and category
- Contact information
- Location
- Reach, service radius, social links
- Business hours
- Compliance uploads
- Gallery
- Video links
- Team members
- Promotions
- Subscription plan display
- Analytics summary
- Verification badge

Several sections are currently frontend-first and need backend support before they can be considered persisted product functionality.

## 7. Backend Contract Risks to Resolve

Resolve these with the backend owner before implementing the next feature against assumptions:

1. **Discovery contract:** business list/detail endpoints, filters, pagination, search, category shape, image fields, coordinates, and error envelope.
2. **Favorites:** confirm whether the favorites module exists, actual paths, POST payload, nested business response shape, and empty-state behavior.
3. **Saved addresses:** editing currently uses delete-then-recreate because an update endpoint is not confirmed. Coordinates are geocoded through OpenStreetMap Nominatim from the browser.
4. **Notification keys:** the backend exposes a generic `Record<string, boolean>`; the four client toggle keys are not formally published.
5. **Business hours:** frontend accepts both the standard envelope and the backend's observed `{ success, businessHours }` shape. Fix the backend response to the standard envelope and retain compatibility until deployed.
6. **Compliance:** uploads reach storage but are not associated with a merchant profile and disappear after refresh.
7. **Gallery:** server endpoints are described as stubs; current UI state is session-only.
8. **Videos:** links are local-only; no confirmed backend field/endpoint.
9. **Subscriptions:** Pro/Premium content is informational; no billing endpoints exist.
10. **Analytics:** current values are derived from profile completeness, staff count, and promotion count, not reporting data.
11. **Staff/promotions:** frontend calls exist, but server-side validation and contract confirmation are needed.
12. **Profile editing:** there is no confirmed endpoint for customer name/phone changes.

## 8. Test Coverage and Baseline

Current tests:

- `tests/unit/business-hours-editor.test.tsx`: business-hours validation and disabled state
- `tests/unit/otp-form.test.tsx`: ASCII-only OTP input regression
- `tests/unit/useMerchantProfile.test.tsx`: loading, 404, errors, update, and cache behavior
- `tests/e2e/auth-history.spec.ts`: login history/back-button behavior
- `tests/e2e/merchant-profile.spec.ts`: merchant profile edit/upload persistence

Baseline captured for this handoff:

- `npx tsc --noEmit`: passes
- `npm run test`: passes, 3 files / 11 tests
- `npm run lint`: fails on `react/display-name` in `tests/unit/useMerchantProfile.test.tsx`; also reports warnings for unused imports in `BusinessComplianceForm.tsx` and image handling in `BusinessGallery.tsx`

Important test gap: `tests/e2e/merchant-profile.spec.ts` mocks `/api/v1/profiles/merchant`, while the implementation calls `/api/v1/merchant/profile`. Reconcile this before treating the E2E test as proof of the real integration.

There are no focused tests yet for customer profile, saved addresses/geocoding, favorites, auth refresh failure, middleware role routing, or the `/home` discovery workflow.

## 9. Recommended Next Sprint

### P0: Establish the discovery vertical slice

1. Confirm business discovery API contracts with the backend.
2. Implement `/home` with nearby/recommended businesses and loading, empty, error, and retry states.
3. Implement `/businesses` with search, category/filter controls, pagination or infinite loading, and URL-persisted query state.
4. Implement `/businesses/:id` with business information, location, contact/action controls, favorite state, and a clear not-found state.
5. Wire favorites to the confirmed backend contract and add query invalidation tests.

### P1: Stabilize current integration

1. Fix or update the stale merchant-profile E2E mock path.
2. Remove the ESLint error and merchant UI warnings.
3. Add tests for middleware routing and the Axios refresh flow.
4. Confirm saved-address update semantics and move geocoding behind the backend if required for rate-limit/privacy reasons.
5. Update `YEGNAFINDER_OVERVIEW.md` and `README.md` so planned/current status matches the code.

### P2: Product follow-through

1. Add merchant bookings and listings pages after backend contracts exist.
2. Add customer booking flow after discovery detail behavior is stable.
3. Add admin/moderator route structure and authorization rules.
4. Replace session-only merchant panels with persisted APIs as each backend module becomes available.
5. Add responsive/mobile and accessibility E2E coverage for the main customer journey.

## 10. Suggested Ownership Split

- **Frontend discovery:** route pages, query state, cards, filters, detail layout, empty/error states, favorites integration.
- **Backend discovery:** business search/detail DTOs, pagination/filter semantics, media URLs, location fields, authorization, favorites module.
- **QA:** auth regression, customer discovery journey, favorites persistence, mobile layout, expired-session behavior.
- **Product/design:** define ranking, search/filter requirements, booking CTA behavior, and which merchant information is mandatory on detail pages.

## 11. First-Day Handoff Checklist

- [ ] Confirm the `package-lock.json` worktree change is intentional.
- [ ] Get the backend Swagger/API contract for businesses and favorites.
- [ ] Run `npm run test` and `npx tsc --noEmit` locally.
- [ ] Decide whether `/home` is the discovery landing page or whether `/businesses` is primary.
- [ ] Create discovery API types before building cards and filters.
- [ ] Add an integration fixture or mock contract for list/detail/favorite responses.
- [ ] Update the stale overview and README after the first discovery slice lands.
