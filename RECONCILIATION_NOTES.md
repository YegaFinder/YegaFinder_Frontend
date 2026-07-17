# Sprint 2 branch ↔ updated `main` — reconciliation notes

## The real issue: a data-contract conflict, not just style drift

Your branch was built against an *old* `profile.types.ts` (the folders
were still `.gitKeep` placeholders when you forked). The senior has since
pushed a **filled-in `profile.types.ts` to `main`** with a different,
already-confirmed `CustomerProfile`/`SavedAddress` shape. That's the
actual merge conflict — everything else (folder structure, ROUTES,
AppHeader nav, layouts, tokens) already lines up fine.

I reconciled by treating **main's `profile.types.ts` as the source of
truth** and rewrote your feature to match it, rather than the other way
around. `profile.types.ts` itself doesn't need to change on your branch —
just add the new request-shape types at the bottom (included in the file
below) the same way `auth.types.ts` does.

## What changed and why

| Main's contract | Your branch had | What I did |
|---|---|---|
| No `firstName/lastName/phone` on `CustomerProfile` (those live on `User` in auth) | Editable in the profile form | Name/email now shown **read-only** from the auth store; form only submits `dateOfBirth`/`bio`/`preferredLanguage` |
| `preferredLanguage: string` | `language: "en" \| "am"` | Renamed field; kept the same two-option select |
| `notificationPreferences: Record<string, boolean>` | Fixed `NotificationPreferences` interface | Component now types it as `Record<string, boolean>`; the 4 toggle keys are kept as a **best-guess list**, not a confirmed contract |
| `savedAddresses` embedded on the profile; `SavedAddress = { id, label, address, latitude, longitude }` | Separate fetch; `{ addressLine1, addressLine2, city, region, isDefault, ... }` | Address form simplified to `label` + single `address` field. **`isDefault` is dropped** — there's nowhere to persist it in main's type |
| `latitude`/`longitude` required, non-null numbers | Not collected from the user | Sent as `0/0` placeholders on create — **flag this for backend/product**: there's no map picker, so real coordinates aren't captured yet |
| `isProfileComplete: boolean` | `profileCompletionPercent: number` | `ProfileCompletionBar` is now a complete/incomplete status banner, not a progress bar |
| `lib/hooks/useImageUpload.ts` is a **fully working** presigned-S3 upload on main | Your comments assumed it was still a dev-only stub | Removed the "stub" language; avatar upload is live once you use it |
| `ImageUploadField` requires an `uploadType` prop | `ProfileAvatar` didn't pass one | Added `uploadType="avatar"` |
| No separate avatar-confirm endpoint on main | `profileApi.confirmAvatarUpload` → `PATCH /profile/me/avatar` | Folded into the existing `updateProfile` call (`PATCH /profile/me` with `{ avatarUrl }`) |

## Everything that already matched main and needed no change
- Folder structure / `.gitKeep` placeholders you're filling in
- `ROUTES.PROFILE` / `SAVED_PLACES` / `FAVORITES` — already defined
- `AppHeader` nav — already links Profile & Saved Places for customers
- `(customer)/layout.tsx` + `useRoleGuard` — your pages just slot in
- Design tokens (`yegna-*` classes, `rounded-[14px]`, etc.) — you were already following the brand system correctly
- `getErrorMessage`, `FieldError`/`FormError`/`Spinner`, toast usage, the manual-`useState` data-fetching convention

## Still genuinely open (need the senior/backend, not guesswork)
1. **Address coordinates**: no map picker exists; `0/0` placeholders will silently break anything depending on real lat/lng (e.g. "nearest to me"). Needs either a map/autocomplete component or server-side geocoding.
2. **Notification preference key names**: `Record<string, boolean>` has no published key list — the four keys used are a guess.
3. **`/profile/addresses/*` and `/profile/me/notifications` endpoint paths**: still unconfirmed, same caveat your original README already had.
4. **Editing name/phone**: no endpoint exists for this at all right now (not on `/profile/me`, not on `/auth/profile`). Worth asking whether that's coming later or was intentionally scoped out.

## Unrelated bug spotted on `main` (not fixed here, flagging for the senior)
`src/features/auth/types/auth.types.ts` has `export type Role = ...` declared **twice**, which fails `tsc --noEmit` on its own. Not something to fix from your branch, but worth a heads-up.

## Verified
- `npx tsc --noEmit` — clean across the whole merged tree (after noting the pre-existing duplicate-`Role` issue above, which isn't from this branch)
- `npx eslint` on all files in this reconciliation — clean
