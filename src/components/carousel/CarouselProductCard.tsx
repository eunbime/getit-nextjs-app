import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import { TProductWithCategory } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CarouselProductCardProps {
  product: TProductWithCategory;
}

const CarouselProductCard: React.FC<CarouselProductCardProps> = ({
  product,
}) => {
  const router = useRouter();

  return (
    <article>
      <div
        className="relative w-full overflow-hidden aspect-square rounded-xl cursor-pointer"
        onClick={() => router.push(`/products/${product.id}`)}
      >
        <Image
          src={product.imageSrc}
          alt={product.title}
          fill
          className="object-cover"
        />
        <div className="absolute flex flex-col gap-4 items-center justify-center inset-0 bg-black/30 z-0 opacity-0 hover:opacity-100 transition-all duration-300">
          <h3 className="text-2xl font-bold text-white">{product.title}</h3>
          <p className="text-sm text-white">
            {CATEGORY_TITLE[product.category.name as CategoryType]}
          </p>
        </div>
      </div>
    </article>
  );
};
export default CarouselProductCard;
