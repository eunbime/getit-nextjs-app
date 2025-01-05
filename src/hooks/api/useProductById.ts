import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
