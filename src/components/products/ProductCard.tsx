"use client";

import Image from "next/image";
import Link from "next/link";

import { TProductWithCategory } from "@/types";
import { fromNow } from "@/helpers/dayjs";
import HeartButton from "@/components/common/HeartButton";

interface ProductCardProps {
  data: TProductWithCategory;
  index?: number;
}

const ProductCard = ({ data }: ProductCardProps) => {
  return (
    <Link
      href={`/products/${data.id}`}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col w-full gap-2">
        <div className="relative w-full overflow-hidden aspect-square rounded-xl">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${data?.imageSrc.replace(
                "/upload/",
                "/upload/w_200,h_200,c_fill,e_blur:300,f_jpg,q_1/"
              )})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(8px)",
            }}
          ></div>
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover w-full h-full transition group-hover:scale-110"
            src={data?.imageSrc}
            alt="Product Image"
            quality={60}
          />
          <div className="absolute top-3 right-3">
            <HeartButton productId={data.id} />
          </div>
        </div>

        <div className="text-lg font-semibold">{data.title}</div>
        <div className="font-light text-neutral-500">{data.category?.name}</div>

        <div className="flex flex-row items-center justify-between gap-1">
          <div className="font-semibold">
            {data?.price?.toLocaleString("ko-KR")}{" "}
            <span className="font-light">원</span>
          </div>
          <div>{fromNow(data?.createdAt)}</div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
