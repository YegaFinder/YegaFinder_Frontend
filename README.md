# YegaFinder Frontend — Sprint 2 fixes

This is not a full copy of the repo — it's just the files that are new or
changed, laid out under `frontend/` in the exact same paths they belong
at in `YegaFinder_Frontend-main`. Drop each file into your working copy
at the matching path (overwrite `SavedAddressesList.tsx`,
`merchant-profile.api.ts`, and both stub pages; the rest are brand new).

All 9 files pass `tsc --noEmit` cleanly against the current `package.json`.

---

## 1. Customer — saved places now actually works

**Changed:** `src/app/(customer)/saved-places/page.tsx`
Was a "coming soon" stub. Now renders the `SavedAddressesList` component,
which already existed but was never mounted anywhere.

**Changed:** `src/features/profile/components/SavedAddressesList.tsx`
Added a "Find location" step. Previously every new address was submitted
with `latitude: 0, longitude: 0` placeholders, because there was no way
to turn typed text into real coordinates. Now:
- Clicking **Find location** geocodes the typed address via OpenStreetMap
  Nominatim (see new file below) and shows a confirmation line with the
  resolved place name.
- Saving is blocked until a location has been confirmed.
- If you edit the address text after confirming, the confirmation is
  marked stale and you have to re-confirm — so a mismatched address/coords
  pair can never be silently saved.
- Editing an existing saved address keeps its existing coordinates as
  "confirmed" unless you change the address text.

**New:** `src/lib/geocode.ts`
A small `geocodeAddress(query)` helper wrapping Nominatim's free search
API — no API key needed. There's a comment in the file noting this
should move behind the backend (or swap to the Google Maps Geocoding
API) if usage grows, since Nominatim is rate-limited and browsers can't
set the descriptive User-Agent its usage policy asks for.

---

## 2. Customer — favorites feature (frontend half)

**New folder:** `src/features/favorites/` (`types/`, `api/`, `hooks/`, `components/`)
Built following the exact same pattern as `src/features/profile/`
(TanStack Query, same envelope handling, same toast/error conventions).

**Changed:** `src/app/(customer)/favorites/page.tsx`
Was a stub, now renders the new `FavoritesList` component.

**Important — this is only the frontend half.** There is still no
`favorites` module on the backend (no entity, no controller — confirmed
by grepping the whole NestJS repo for "favorite"). The endpoints this
code calls (`GET /favorites`, `POST /favorites/:businessId`,
`DELETE /favorites/:businessId`) are proposed paths, not confirmed ones.

Because of that, the hook (`useFavorites.ts`) treats a 404/501 from
`GET /favorites` as "not built yet" rather than a real error, and the
page shows a friendly "Favorites is coming soon" placeholder instead of
an error banner. Once the backend `favorites` module ships:
1. Confirm the real paths/response shape against the controller.
2. Update `favorites.api.ts` if anything differs.
3. Nothing else needs to change — the "not built yet" placeholder stops
   showing itself automatically once the real endpoint responds.

---

## 3. Merchant — business-hours envelope workaround made resilient

**Changed:** `src/features/profile/api/merchant-profile.api.ts`

The backend's `updateBusinessHours` controller returns
`{ success, businessHours }` instead of the standard `{ data: {...} }`
shape, so the interceptor's fallback re-wraps the whole object and the
array ends up at `response.data.data.businessHours` instead of
`response.data.data`. This was already worked around, but the old code
only handled the buggy shape — if the backend fixes it, the frontend
would break.

The new version checks **both** shapes at runtime, so:
- Today (bug still present): works exactly as before.
- After the backend fix ships: keeps working with zero frontend changes.

---

## What this bundle does NOT include

Per the review, these still need backend work first and aren't
frontend-fixable on their own:
- The `favorites` NestJS module (entity/controller/service) — see the
  backend action items from the review.
- Fixing the `updateBusinessHours` response shape server-side (the
  frontend workaround above is a stopgap, not a substitute for that fix).
