import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const prefetchProductById = async (
  queryClient: QueryClient,
  productId?: string | null
) => {
  try {
    return queryClient.prefetchQuery({
      queryKey: ["product", productId],
      queryFn: async () => {
        if (!productId) throw new Error("Product ID is required");
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
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
    throw new Error("상품 프리페치 중 오류 발생");
  }
};

export const useProductById = (productId?: string | null) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) return null;
      const { data } = await axios.get(`/api/products/${productId}`);
      return data;
    },
    enabled: !!productId,
  });
};
