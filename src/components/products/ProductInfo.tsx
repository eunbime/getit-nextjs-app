import { Category, User } from "@prisma/client";
import { IconType } from "react-icons";
import Avatar from "../common/Avatar";
import { formatTime } from "@/helpers/dayjs";
import ProductCategory from "./ProductCategory";

interface ProductInfoProps {
  user: User;
  category: Category | undefined;
  createdAt: Date;
  description: string;
  subCategory: string;
}

const ProductInfo = ({
  user,
  category,
  createdAt,
  description,
  subCategory,
}: ProductInfoProps) => {
  return (
    <div className="flex flex-col gap-8">
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
        <ProductCategory
          label={category?.name}
          description={category?.description || ""}
          subCategory={subCategory}
        />
      )}
      <hr />
      <div className="text-lg font-light text-neutral-500">{description}</div>
    </div>
  );
};

export default ProductInfo;
