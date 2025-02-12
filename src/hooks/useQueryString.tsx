import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useQueryString = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams?.toString());
      Object.entries(updates).forEach(([key, value]) => {
        params.set(key, value);
      });
      router.push(`/talk?${params.toString()}`);
    },
    [router, searchParams]
  );

  return { updateQueryString };
};
