import useFavorite from "@/hooks/useFavorite";
import { User } from "@prisma/client";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface HeartButtonProps {
  productId: string;
  currentUser?: User | null;
}

const HeartButton = ({ productId, currentUser }: HeartButtonProps) => {
  const { hasFavorited, toggleFavorite } = useFavorite({
    productId,
    currentUser,
  });

  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // 이벤트 버블링 중지
        e.preventDefault(); // 기본 동작 중지
        toggleFavorite();
      }}
      className="relative transition cursor-pointer hover-opacity-80"
    >
      <AiOutlineHeart
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={24}
        className={hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
};

export default HeartButton;
