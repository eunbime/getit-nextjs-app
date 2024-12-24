import { User } from "@prisma/client";
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

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(productId);
  }, [currentUser, productId]);

  const toggleFavorite = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!currentUser) {
      toast.warn("먼저 로그인을 해주세요");
      return;
    }

    try {
      let request;

      if (hasFavorited) {
        request = () => axios.delete(`/api/favorites/${productId}`);
      } else {
        request = () => axios.post(`/api/favorites/${productId}`);
      }

      await request();
      router.refresh();

      if (hasFavorited) {
        toast.success("찜한 목록에서 삭제되었습니다.");
      } else {
        toast.success("찜한 목록에 추가되었습니다.");
      }
    } catch (error) {
      console.log(error);
      toast.error("오류가 발생했습니다.");
    }
  };

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
