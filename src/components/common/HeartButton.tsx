import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import { User } from "@prisma/client";
import useFavorite from "@/hooks/useFavorite";

interface HeartButtonProps {
  productId: string;
  currentUser?: User | null;
}

const HeartButton = ({ productId, currentUser }: HeartButtonProps) => {
  const { toggleFavorite, isFavorite } = useFavorite({
    productId,
    currentUser,
  });

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
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
        className={isFavorite ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
};

export default HeartButton;
