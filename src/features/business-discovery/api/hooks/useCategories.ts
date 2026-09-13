import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { categoriesApi } from "../categories.api";
import { FALLBACK_SEED_CATEGORIES } from "@/constants/categories";
import { useAuthStore } from "@/store/auth-store";

/**
 * FIXED: GET /categories requires a JWT despite being conceptually public
 * data (B3 in YegnaFinder_Backend_Reference.md §16 / §7.7's auth gotcha).
 * A logged-out visitor on a public page like /nearby or /search previously
 * got a 401 here with no fallback — react-query just sat in an error
 * state and the filter chips silently never appeared.
 *
 * Now: a guest (no access token) skips the real call entirely and gets
 * the hardcoded seed-category fallback the doc recommends. A logged-in
 * user still hits the real endpoint; if that call somehow still 401s
 * (e.g. token expired mid-session), fall back the same way rather than
 * surfacing a hard error for what's meant to be non-critical filter UI.
 */
export function useCategories() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["categories", isAuthenticated],
    queryFn: async () => {
      if (!isAuthenticated) {
        return { data: FALLBACK_SEED_CATEGORIES };
      }
      try {
        return await categoriesApi.getCategories();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          return { data: FALLBACK_SEED_CATEGORIES };
        }
        throw err;
      }
    },
  });
}
