import { User } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "react-toastify";

interface UseFavoriteProps {
  productId: string;
  currentUser?: User | null;
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
        toast.warn("먼저 로그인을 해주세요");
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
      queryClient.setQueryData(["favorites"], (old: any) => {
        if (!old) return [];
        return hasFavorited
          ? old.filter((product: any) => product.id !== productId)
          : [...old, { id: productId }];
      });

      // products 쿼리 캐시도 업데이트
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return { data: [] };
        return {
          ...old,
          data: old.data.map((product: any) => {
            if (product.id === productId) {
              return {
                ...product,
                favorited: !hasFavorited,
              };
            }
            return product;
          }),
        };
      });

      // 이전 상태 반환 (롤백을 위해)
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
      console.log(error);
      queryClient.setQueryData(["favorites"], context!.previousFavorites);
      queryClient.setQueryData(["products"], context!.previousProducts);
      toast.error("오류가 발생했습니다.");
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
