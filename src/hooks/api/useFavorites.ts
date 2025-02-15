import { useUserStore } from "@/store/userStore";
import { TLikeWithProduct, TProductWithCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFavorites = () => {
  const { currentUser } = useUserStore();

  return useQuery<TProductWithCategory[]>({
    // 쿼리키 규칙 고민하기 (UserPosts 컴포넌트 참고)
    queryKey: ["favorites", currentUser?.id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/likes/by-user/${currentUser?.id}`);
      return data.map((like: TLikeWithProduct) => like.product);
    },
    enabled: !!currentUser,
  });
};
