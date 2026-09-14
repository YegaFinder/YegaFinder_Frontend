// Key names here are a pure frontend implementation detail — the backend
// never sees them. Kept as-is (camelCase to match the docs' snippets)
// plus a cookie mirror, since Next.js middleware runs server-side and
// can't read localStorage at all.
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const HAS_SESSION_COOKIE = "has_session";
const ROLE_COOKIE = "user_role";

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
  if (role) setCookie(ROLE_COOKIE, role);
}

export function removeTokens() {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("user");
  deleteCookie(HAS_SESSION_COOKIE);
  deleteCookie(ROLE_COOKIE);
}