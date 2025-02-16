import { TProductWithCategory } from "@/types";
import { QueryClient, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export interface SearchParams {
  category?: string;
  subcategory?: string;
}

interface ProductResponse {
  data: TProductWithCategory[];
  hasMore: boolean;
  currentPage: number;
}

export const prefetchProducts = async (queryClient: QueryClient) => {
  try {
    return queryClient.prefetchInfiniteQuery({
      queryKey: ["products", "category", "", ""],
      initialPageParam: 1,
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
          {
            params: {
              category: "",
              subcategory: "",
              page: pageParam.toString(),
              limit: "10",
            },
          }
        );
        return data;
      },
      getNextPageParam: (lastPage: any) =>
        lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("상품 프리페치 중 오류 발생");
  }
};

export const useProducts = (searchParams: SearchParams) => {
  return useInfiniteQuery<ProductResponse>({
    queryKey: [
      "products",
      "category",
      searchParams.category,
      searchParams.subcategory,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          params: {
            ...searchParams,
            page: pageParam,
            limit: 10,
          },
        }
      );
      return data;
    },
    getNextPageParam: (lastPage: any) => {
      if (lastPage.hasMore) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};
