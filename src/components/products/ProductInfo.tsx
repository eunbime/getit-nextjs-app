import { User } from "@prisma/client";
import { formatTime } from "@/helpers/dayjs";
import ProductCategory from "./ProductCategory";
import Avatar from "@/components/common/Avatar";

interface ProductInfoProps {
  user: User;
  category: string;
  createdAt: Date;
  description: string;
  subCategory: string;
  price: number;
}

const ProductInfo = ({
  user,
  category,
  createdAt,
  description,
  subCategory,
  price,
}: ProductInfoProps) => {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Avatar src={user?.image} />
          <div>{user?.name}</div>
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
          <div>{formatTime(createdAt)}</div>
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
