"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { User } from "@prisma/client";
import { TProductWithCategory } from "@/types";
import { fromNow } from "@/helpers/dayjs";
import HeartButton from "@/components/common/HeartButton";

interface ProductCardProps {
  data: TProductWithCategory;
  currentUser?: User | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ data, currentUser }) => {
  const router = useRouter();
  return (
    <article
      onClick={() => router.push(`/products/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col w-full gap-2">
        <div className="relative w-full overflow-hidden aspect-square rounded-xl">
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover w-full h-full transition group-hover:scale-110"
            src={data.imageSrc}
            alt="Product Image"
            priority
            quality={80}
          />
          <div className="absolute top-3 right-3">
            <HeartButton productId={data.id} currentUser={currentUser} />
          </div>
        </div>

        <div className="text-lg font-semibold">{data.title}</div>
        <div className="font-light text-neutral-500">{data.category?.name}</div>

        <div className="flex flex-row items-center justify-between gap-1">
          <div className="font-semibold">
            {data.price.toLocaleString("ko-KR")}{" "}
            <span className="font-light">원</span>
          </div>
          <div>{fromNow(data.createdAt)}</div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
