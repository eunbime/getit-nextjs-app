import { InfiniteData } from "@tanstack/react-query";

import { Product, User } from "@prisma/client";
import { TProductWithCategory } from "@/types";
import ProductCard from "@/components/products/ProductCard";

interface ProductPage {
  data: Product[];
  hasMore: boolean;
  currentPage: number;
}

interface ProductListProps {
  products: InfiniteData<ProductPage> | undefined;
  currentUser?: User | null;
}

export default function ProductList({
  products,
  currentUser,
}: ProductListProps) {
  return (
    <div
      className="w-full grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3
        lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
    >
      {products?.pages.flatMap((page) =>
        page.data.map((product: Product) => (
          <ProductCard
            key={product.id}
            data={product as TProductWithCategory}
            currentUser={currentUser}
          />
        ))
      )}
    </div>
  );
}
