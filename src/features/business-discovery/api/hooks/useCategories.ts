import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../categories.api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getCategories,
  });
}