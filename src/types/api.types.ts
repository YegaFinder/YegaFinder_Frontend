/**
 * Generic wrapper matching the backend's standard response envelope.
 * Applies to most, but NOT all, endpoints — several controllers return
 * raw/ad-hoc shapes instead (business-hours, gallery, bookings, reviews,
 * /listings*). Check the specific api.ts file's comments before assuming
 * this wrapper applies.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * FIXED: this used to describe a shape (`{success, data: T[], meta:
 * {page, pageSize, totalItems, totalPages}}`) that no real endpoint
 * returns. The actual pagination shape, used by /listings,
 * /listings/search, /listings/nearby, is PaginatedListingsResponse in
 * @/types/business.types.ts — { listings, meta: {total, page, limit} },
 * with NO `success`/`data` wrapper at that level. Prefer that type for
 * anything listing-related. This one is kept only for admin endpoints
 * that DO paginate inside the envelope (e.g. GET /admin/users,
 * GET /admin/reviews return { data, total, page, limit } inside
 * response.data — still not an exact match, adjust per-endpoint).
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Shape of the error body the global HttpExceptionFilter returns.
 * FIXED: added `statusCode`/`method`, and `message` is a union — it's a
 * string[] specifically for 400 validation failures (class-validator via
 * the global ValidationPipe), and a plain string for everything else.
 * Use getErrorMessage() from @/lib/errors instead of reading this
 * directly — it already handles both cases.
 */
export interface ApiError {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[] | null;
}