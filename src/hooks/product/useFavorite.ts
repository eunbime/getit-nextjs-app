import axios from "axios";
import { toast } from "react-toastify";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Like, User } from "@prisma/client";
import { useState } from "react";

interface UseFavoriteProps {
  productId: string;
  currentUser?: User | null;
}

const useFavorite = ({ productId, currentUser }: UseFavoriteProps) => {
  const queryClient = useQueryClient();
  // setOptimisticLiked 사용하지 않음 -> optimisticLiked 역시 변경되는 상태가 아닌 것으로 보입니다
  // 굳이 필요없는 정보가 아닐까 생각합니다.
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);

  const { data: likes } = useQuery<Like[]>({
    queryKey: ["likes", currentUser?.id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/api/likes/by-user/${currentUser?.id}`
        );
        return response.data;
      } catch (error) {
        // 개발자에게 오류 메세지를 전달할 수 있는 로깅 시스템을 추후에 도입해봅시다.
        console.error(error);
        toast.error("찜 목록을 불러오는 중 오류가 발생했습니다.");
      }
    },
    enabled: !!currentUser,
  });

  const isLiked =
    optimisticLiked ??
    (likes?.some((like) => like.productId === productId) || false);

  const { mutate: toggleFavorite } = useMutation<
    void,
    Error,
    void,
    { previousLikes: Like[] }
  >({
    mutationFn: async () => {
      return isLiked
        ? axios.delete(`/api/likes/${productId}`)
        : axios.post(`/api/likes/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", currentUser?.id] });
      queryClient.invalidateQueries({
        queryKey: ["favorites", currentUser?.id],
      });
      toast.success(
        !isLiked ? "찜 목록에 추가되었습니다." : "찜 목록에서 제거되었습니다."
      );
    },
    onError: () => {
      toast.error("일시적인 오류가 발생했습니다.");
    },
  });

  return { isLiked, toggleFavorite };
};

export default useFavorite;
