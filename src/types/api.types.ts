/**
 * Generic wrapper matching the backend's standard response envelope.
 * Use this instead of writing a one-off "XResponse" type per endpoint:
 *
 *   const res: ApiResponse<Business> = await apiClient.get(...)
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Wrapper for any list endpoint that returns pagination info
 * (business listings, bookings, reviews, etc. — first needed in Sprint 3).
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

/** Shape of a validation/auth error the backend returns on failure. */
export interface ApiError {
  success: false;
  message: string;
  path: string;
  timestamp: string;
}
