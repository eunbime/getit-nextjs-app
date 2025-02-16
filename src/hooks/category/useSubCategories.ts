import { CategoryType } from "@/constants/categories";
import { Subcategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useSubCategories = (category: CategoryType | null) => {
  return useQuery<Subcategory[]>({
    queryKey: ["sub-categories", category],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/sub-categories?category=${category}`
      );
      return data;
    },
    enabled: !!category,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });
};
