// Single source of truth for the 3 response patterns from
// FRONTEND_API_IMPLEMENTATION_GUIDE.md §2, PLUS defensive helpers for the
// two endpoints the backend team's own docs flag as inconsistent
// (business-hours §10.4, review-submit §5.2). These never throw on an
// unexpected shape — they degrade to a safe fallback instead, so a flaky
// or changing backend response can't crash a page.

/** Pattern A: standard envelope. Parse with response.data.data */
export interface ApiEnvelope<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

/** Pattern B: paginated discovery envelope. Parse with response.data.data.items etc. */
export interface PaginatedEnvelope<T> {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  success?: boolean;
  timestamp?: string;
}

/** Pattern C: direct array or direct object, no envelope at all. Parse with response.data. */
export type DirectResponse<T> = T;

export function unwrapEnvelope<T>(res: ApiEnvelope<T>): T {
  return res.data;
}

export function unwrapPaginated<T>(res: PaginatedEnvelope<T>) {
  return res.data;
}

/**
 * Some auth endpoints (register/resend-verification/forgot-password) can
 * come back already-unwrapped when TEST_MODE=false. Use this instead of
 * assuming either shape blindly.
 */
export function unwrapNullableEnvelope<T>(data: unknown): T | null {
  if (data && typeof data === "object" && "success" in data && "message" in data) {
    return null;
  }
  return data as T;
}

/**
 * For a value that's DOCUMENTED as sometimes-enveloped-sometimes-not
 * (guide §5.2: review submission "might not have full envelope").
 * If `payload.data` exists and is itself an object, unwrap it.
 * Otherwise assume payload already IS the object. Never throws.
 */
export function unwrapMaybeEnveloped<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in (payload as Record<string, unknown>) &&
    (payload as Record<string, unknown>).data &&
    typeof (payload as Record<string, unknown>).data === "object"
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

/**
 * For the two confirmed-inconsistent merchant endpoints (guide §10.4,
 * §10.7): business-hours and gallery each come back as EITHER
 *   { data: { [key]: T[] } }   (standard envelope, key nested inside data)
 *   { [key]: T[], success }    (bespoke top-level shape, no `data` wrapper)
 * Tries every real shape actually documented, in order, then falls back
 * to an empty array rather than throwing — a page should render "no
 * hours set yet" / "no photos yet," never a crash, if the backend
 * changes this again.
 */
export function unwrapFlexibleList<T>(payload: unknown, key: string): T[] {
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;

  // { data: { [key]: T[] } }
  if (obj.data && typeof obj.data === "object") {
    const inner = (obj.data as Record<string, unknown>)[key];
    if (Array.isArray(inner)) return inner as T[];
    // { data: T[] } — key wasn't nested, data itself is the array
    if (Array.isArray(obj.data)) return obj.data as T[];
  }

  // { [key]: T[] } top-level (the bespoke shape)
  if (Array.isArray(obj[key])) return obj[key] as T[];

  // payload IS the array directly
  if (Array.isArray(payload)) return payload as T[];

  return [];
}