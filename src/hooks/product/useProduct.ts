import { Category, Subcategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UseProductProps {
  productId?: string;
}

// 훅 하나에 너무 많은 기능이 포함되어 있는 상태
//  -> 다만 항상 함께 쓰는 훅이라면 분리하지 않아도 됩니다. 만약 분리하지 않을 예정이라면 이름이라도 좀 더 명확하게 변경을 하는 것이 좋을 것 같습니다.
// ex) useProductWithCategories
export const useProduct = ({ productId }: UseProductProps) => {
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
