import axios from "axios";

const DEFAULT_STATUS_MESSAGES: Record<number, string> = {
  400: "That request wasn't valid — please check the form and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "That already exists or conflicts with something else.",
  429: "Too many attempts. Please try again shortly.",
  500: "Something went wrong on our end. Please try again shortly.",
  503: "The service is temporarily unavailable. Please try again shortly.",
};

/**
 * Precedence: caller `overrides` for that status → backend's own
 * `message` → generic default for that status → fully generic fallback.
 *
 * BACKEND_INTEGRATION_GUIDE.md §4: `message` is a `string[]` specifically
 * for 400 validation failures (global ValidationPipe), and a plain
 * `string` for everything else — both are handled here.
 */
export function getErrorMessage(err: unknown, overrides?: Record<number, string>): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status && overrides?.[status]) {
      return overrides[status];
    }
    const rawMessage = err.response?.data?.message;
    if (rawMessage) {
      return Array.isArray(rawMessage) ? rawMessage.join(" ") : rawMessage;
    }
    if (status && DEFAULT_STATUS_MESSAGES[status]) {
      return DEFAULT_STATUS_MESSAGES[status];
    }
  }
  return "Something went wrong. Please try again.";
}