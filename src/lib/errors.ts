import axios from "axios";

/**
 * Extracts a user-friendly error message from an unknown error (typically thrown by Axios).
 * @param err The error thrown by the catch block.
 * @param overrides An optional map of HTTP status codes to custom error strings.
 */
export function getErrorMessage(err: unknown, overrides?: Record<number, string>): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status && overrides && overrides[status]) {
      return overrides[status];
    }
    if (err.response?.data?.message) {
      return err.response.data.message as string;
    }
  }
  return "Something went wrong. Please try again.";
}
