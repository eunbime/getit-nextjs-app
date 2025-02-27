import { User } from "@prisma/client";

import { formatTime } from "@/helpers/dayjs";
import { useOpenChat } from "@/hooks/chat/useOpenChat";
import ProductCategory from "@/components/products/ProductCategory";
import Avatar from "@/components/common/Avatar";
import { Button } from "../ui/button";

interface ProductInfoProps {
  user?: User;
  category?: string;
  createdAt?: Date;
  description?: string;
  subCategory?: string;
  price?: number;
}

const ProductInfo = ({
  user,
  category,
  createdAt,
  description,
  subCategory,
  price,
}: ProductInfoProps) => {
  const { handleOpenChat } = useOpenChat({
    user: user,
  });
  return (
    <div className="flex flex-col gap-8 w-full mt-16">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 w-fit">
          <Avatar src={user?.image} size="md" />
          <p className="text-lg font-semibold px-2">{user?.name}</p>
          <Button
            variant="primary"
            className="flex flex-col items-center rounded-md py-1 px-3 font-semibold bg-main-blue text-white hover:opacity-80 transition-all duration-300"
            onClick={handleOpenChat}
          >
            채팅하기
          </Button>
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
          <div>{formatTime(createdAt as Date)}</div>
        </div>
      </div>
      <hr />
      {category && (
        <ProductCategory label={category} subCategory={subCategory} />
      )}
      <hr />
      <div className="text-lg font-light text-neutral-800 ml-4">
        {Number(price).toLocaleString("ko-KR")}원
      </div>
      <hr />
      <div className="text-lg font-light text-neutral-500 mx-4 break-words whitespace-pre-wrap">
        {description}
      </div>
    </div>
  );
};

export default ProductInfo;
