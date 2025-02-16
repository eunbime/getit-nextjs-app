import axios from "axios";
import { QueryClient, useQuery } from "@tanstack/react-query";

export const prefetchLatestProducts = (queryClient: QueryClient) => {
  try {
    return queryClient.prefetchQuery({
      queryKey: ["products", "latest"],
      queryFn: async () => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/latest`,
          {
            params: {
              limit: 10,
              page: 1,
            },
            headers: {
              "Cache-Control": "no-store",
            },
          }
        );
        return data;
      },
    });
  } catch (error) {
    console.error("최신 상품 프리페치 중 오류 발생:", error);
    throw error;
  }
};

export const useLatestProducts = () => {
  return useQuery({
    queryKey: ["products", "latest"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/latest`,
        {
          params: {
            limit: 10,
            page: 1,
          },
        }
      );
      return response.data;
    },
  });
};
