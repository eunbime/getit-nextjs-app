import { TProductWithCategory } from "@/types";
import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const prefetchPopularProducts = async (queryClient: QueryClient) => {
  try {
    return queryClient.prefetchQuery<TProductWithCategory[]>({
      queryKey: ["products", "popular"],
      queryFn: async () => {
        const { data } = await axios.get<TProductWithCategory[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/popular`,
          {
            headers: {
              "Cache-Control": "no-store",
            },
          }
        );
        return data;
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("인기 상품 프리페치 중 오류 발생");
  }
};

export const usePopularProducts = () => {
  return useQuery<TProductWithCategory[]>({
    queryKey: ["products", "popular"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/popular`
      );
      return data;
    },
  });
};
