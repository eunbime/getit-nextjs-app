import { TProductWithCategory } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export interface SearchParams {
  category?: string;
  subcategory?: string;
  [key: string]: string | undefined;
}

interface ProductResponse {
  data: TProductWithCategory[];
  hasMore: boolean;
  currentPage: number;
}

export const getProducts = async (searchParams: SearchParams) => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL;

  const { data } = await axios.get(`${baseUrl}/api/products`, {
    params: {
      ...searchParams,
      page: searchParams.page,
      limit: searchParams.limit,
    },
  });
  return data;
};

export const useProducts = (searchParams: SearchParams) => {
  return useInfiniteQuery<ProductResponse>({
    queryKey: ["products", searchParams.category, searchParams.subcategory],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get("/api/products", {
        params: {
          ...searchParams,
          page: pageParam,
          limit: 10,
        },
      });
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
