import { Category, Subcategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UseProductProps {
  productId?: string;
}

export const useProductWithCategory = ({ productId }: UseProductProps) => {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      return data;
    },
  });

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: ["category", productId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/categories/${productId}`);
      return data[0];
    },
    enabled: !!productId,
  });

  const { data: subCategory, isLoading: subCategoryLoading } =
    useQuery<Subcategory>({
      queryKey: ["subCategory", productId],
      queryFn: async () => {
        const { data } = await axios.get(
          `/api/categories/sub-categories/${productId}`
        );
        return data[0];
      },
      enabled: !!productId,
    });

  return {
    product,
    isLoading: isLoading || categoryLoading || subCategoryLoading,
    error,
    category,
    subCategory,
  };
};
