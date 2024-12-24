"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HeartButton from "../common/HeartButton";
import { fromNow } from "@/helpers/dayjs";
import { TProductWithCategory } from "@/types";

interface ProductCardProps {
  data: TProductWithCategory;
  currentUser: User | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ data, currentUser }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/products/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col w-full gap-2">
        <div className="relative w-full overflow-hidden aspect-square rounded-xl">
          <Image
            fill
            sizes="auto"
            className="object-cover w-full h-full trasition group-hover:scale-110"
            src={data.imageSrc}
            alt="Listing"
          />
          <div className="absolute top-3 right-3">
            <HeartButton productId={data.id} currentUser={currentUser} />
          </div>
        </div>

        <div className="text-lg font-semibold">{data.title}</div>
        <div className="font-light text-neutral-500">{data.category?.name}</div>

        <div className="flex flex-row items-center justify-between gap-1">
          <div className="font-semibold">
            {data.price} <span className="font-light">원</span>
          </div>
          <div>{fromNow(data.createdAt)}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
