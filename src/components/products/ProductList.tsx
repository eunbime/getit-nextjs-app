import { InfiniteData } from "@tanstack/react-query";

import { Product } from "@prisma/client";
import { TProductWithCategory } from "@/types";
import ProductCard from "@/components/products/ProductCard";

interface ProductPage {
  data: Product[];
  hasMore: boolean;
  currentPage: number;
}

interface ProductListProps {
  products: InfiniteData<ProductPage> | undefined;
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div
      data-testid="product-grid"
      className="w-full grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3
        lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
    >
      {products?.pages.flatMap((page) =>
        page.data.map((product: Product) => (
          <ProductCard
            key={product.id}
            data={product as TProductWithCategory}
          />
        ))
      )}
    </div>
  );
}
