import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import { TProductWithCategory } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CarouselProductCardProps {
  product: TProductWithCategory;
}

const CarouselProductCard = ({ product }: CarouselProductCardProps) => {
  const router = useRouter();

  return (
    <article>
      <div
        className="relative w-full overflow-hidden aspect-square rounded-xl cursor-pointer"
        onClick={() => router.push(`/products/${product.id}`)}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${product.imageSrc.replace(
              "/upload/",
              "/upload/w_200,h_200,c_fill,e_blur:300,f_jpg,q_1/"
            )})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
          }}
        />
        <Image
          src={product.imageSrc}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute flex flex-col gap-4 items-center justify-center inset-0 bg-black/30 z-0 opacity-0 hover:opacity-100 transition-all duration-300">
          <h3 className="text-lg lg:text-2xl font-bold text-white">
            {product.title}
          </h3>
          <p className="text-xs sm:text-sm lg:text-lg md:font-semibold text-white">
            {CATEGORY_TITLE[product.category.name as CategoryType]}
          </p>
        </div>
      </div>
    </article>
  );
};
export default CarouselProductCard;
