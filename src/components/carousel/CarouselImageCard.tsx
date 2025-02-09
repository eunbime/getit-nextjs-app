import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import { TProductWithCategory } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface CarouselImageCardProps {
  product: TProductWithCategory;
}

const CarouselImageCard = ({ product }: CarouselImageCardProps) => {
  return (
    <div className="relative flex md:flex-row flex-col justify-around items-center bg-gray-200 rounded-md h-full p-10 overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${product.imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) brightness(1.0)",
        }}
      />
      <div className="absolute inset-0 bg-black/10 z-0" />
      <div className="relative w-[300px] aspect-square overflow-hidden rounded-md">
        <Image
          src={product.imageSrc}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col gap-4 z-10 items-center p-5">
        <h3 className="text-2xl font-bold">{product.title}</h3>
        <p className="text-sm text-gray-500">
          {CATEGORY_TITLE[product.category.name as CategoryType]}
        </p>
        <Link
          href={`/products/${product.id}`}
          className="bg-black text-white px-4 py-2 rounded-md hover:opacity-70 transition-opacity duration-300"
        >
          상품 보러가기
        </Link>
      </div>
    </div>
  );
};

export default CarouselImageCard;
