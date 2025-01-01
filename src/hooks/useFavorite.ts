import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "react-toastify";

import { User } from "@prisma/client";

interface UseFavoriteProps {
  productId: string;
  currentUser?: User | null;
}

interface FavoriteProduct {
  id: string;
  favorited: boolean;
}

interface ProductsResponse {
  data: FavoriteProduct[];
}

const useFavorite = ({ productId, currentUser }: UseFavoriteProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(productId);
  }, [currentUser, productId]);

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async () => {
      if (!currentUser) {
        toast.warn("로그인 후 이용해주세요");
        return;
      }

      if (hasFavorited) {
        return axios.delete(`/api/favorites/${productId}`);
      } else {
        return axios.post(`/api/favorites/${productId}`);
      }
    },
    // 낙관적 업데이트
    onMutate: async () => {
      // 진행 중인 refetch들을 취소
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // 이전 상태 저장
      const previousFavorites = queryClient.getQueryData(["favorites"]);
      const previousProducts = queryClient.getQueryData(["products"]);

      // 현재 사용자의 favoriteIds 업데이트
      const newFavoriteIds = hasFavorited
        ? (currentUser?.favoriteIds || []).filter((id) => id !== productId)
        : [...(currentUser?.favoriteIds || []), productId];

      // 낙관적으로 캐시 업데이트
      queryClient.setQueryData(
        ["favorites"],
        (old: ProductsResponse[] | undefined) => {
          if (!old) return [];
          return hasFavorited
            ? old.filter((product: any) => product.id !== productId)
            : [...old, { id: productId }];
        }
      );

      // products 쿼리 캐시도 업데이트
      queryClient.setQueryData(
        ["products"],
        (old: ProductsResponse | undefined) => {
          if (!old) return { data: [] };
          return {
            ...old,
            data: old.data.map((product: FavoriteProduct) => {
              if (product.id === productId) {
                return {
                  ...product,
                  favorited: !hasFavorited,
                };
              }
              return product;
            }),
          };
        }
      );

      // currentUser 상태도 업데이트
      queryClient.setQueryData(["currentUser"], (old: User | undefined) => {
        if (!old) return;
        return {
          ...old,
          favoriteIds: newFavoriteIds,
        };
      });

      // 이전 상태 반환
      return { previousFavorites, previousProducts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (currentUser) {
        toast.success(
          hasFavorited
            ? "찜 목록에서 제거되었습니다."
            : "찜 목록에 추가되었습니다."
        );
      }
      router.refresh();
    },
    onError: (error, variables, context) => {
      console.log("찜 목록 오류", error);
      queryClient.setQueryData(["favorites"], context!.previousFavorites);
      queryClient.setQueryData(["products"], context!.previousProducts);
      toast.error("일시적인 오류가 발생했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
