import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { User } from "@prisma/client";

interface UseFavoriteProps {
  productId: string;
  currentUser?: User | null;
}

const useFavorite = ({ productId, currentUser }: UseFavoriteProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isFavorite, setIsFavorite] = useState(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(productId);
  });

  console.log(currentUser?.favoriteIds);

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async () => {
      if (!currentUser) {
        toast.warn("로그인 후 이용해주세요");
        return;
      }

      if (isFavorite) {
        return await axios.post(`/api/favorites/${productId}`);
      } else {
        return await axios.delete(`/api/favorites/${productId}`);
      }
    },
    onMutate: () => {
      setIsFavorite(!isFavorite);
    },
    onSuccess: () => {
      toast.success(
        !isFavorite
          ? "찜 목록에서 제거되었습니다."
          : "찜 목록에 추가되었습니다."
      );

      queryClient.invalidateQueries({ queryKey: ["favorite"] });
      router.refresh();
    },
    onError: (error) => {
      console.log("좋아요 오류", error);
      toast.error("일시적인 오류가 발생했습니다.");
      setIsFavorite(isFavorite);
    },
  });

  return {
    isFavorite,
    toggleFavorite,
  };
};

export default useFavorite;
