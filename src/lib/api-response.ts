export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}


export function unwrapNullableEnvelope<T>(data: unknown): T | null {
  if (data && typeof data === "object" && "success" in data && "message" in data) {
    return null;
  }
  return data as T;
}