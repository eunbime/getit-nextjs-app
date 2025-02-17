import { CategoryType } from "@/constants/categories";
import { Subcategory } from "@prisma/client";
import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const prefetchSubCategories = async (
  queryClient: QueryClient,
  category?: CategoryType
) => {
  try {
    return queryClient.prefetchQuery({
      queryKey: ["sub-categories", category],
      queryFn: async () => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories/sub-categories?category=${category}`
        );
        return data;
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("서브 카테고리를 불러오는데 실패했습니다.");
  }
};

export const useSubCategories = (category: CategoryType) => {
  try {
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
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("서브 카테고리를 불러오는데 실패했습니다.");
  }
};
