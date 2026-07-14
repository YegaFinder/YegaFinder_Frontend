const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const HAS_SESSION_COOKIE = "has_session";
const ROLE_COOKIE = "user_role";
/**
 * Why both localStorage AND a cookie:
 *
 * - localStorage is what api-client.ts reads to attach the
 *   Authorization header on every request, from the browser.
 * - Next.js middleware (src/middleware.ts) runs on the SERVER, before a
 *   page even renders — and the server has no access to localStorage
 *   (there's no `window` there). Middleware can only read cookies,
 *   since cookies are sent along with every request automatically.
 *
 * So we mirror the access token into a lightweight, JS-readable cookie
 * purely so middleware has something to check for route protection.
 * This cookie is NOT httpOnly (it's set from client JS), so it should
 * only ever be used for a presence check ("is there a token at all?"),
 * never trusted as a secure source of truth — the real authorization
 * check still happens against the backend on every API call.
 */

function isBrowser() {
  return typeof window !== "undefined";
}

function setCookie(name: string, value: string, days = 7) {
  if (!isBrowser()) return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (!isBrowser()) return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string, role?: string) {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  setCookie(HAS_SESSION_COOKIE, "1");
  if (role) {
    setCookie(ROLE_COOKIE, role);
  }
}

export function removeTokens() {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  deleteCookie(HAS_SESSION_COOKIE);
  deleteCookie(ROLE_COOKIE);
}
