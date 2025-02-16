import { InfiniteData } from "@tanstack/react-query";

import { Product } from "@prisma/client";
import { TProductWithCategory } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import LoadingCards from "./LoadingCards";
import { SearchParams } from "@/hooks/product/useProducts";

interface ProductPage {
  data: Product[];
  hasMore: boolean;
  currentPage: number;
}

interface ProductListProps {
  products: InfiniteData<ProductPage> | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  searchParams: SearchParams;
}

export default function ProductList({
  products,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
}: ProductListProps) {
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div
      data-testid="product-grid"
      className="w-full grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3
        lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8"
    >
      {products?.pages.flatMap((page) =>
        page.data.map((product: Product, index: number) => (
          <ProductCard
            key={product.id}
            data={product as TProductWithCategory}
            index={index}
          />
        ))
      )}
      {isFetchingNextPage &&
        Array.from({ length: 10 }).map((_, index) => (
          <LoadingCards key={index} />
        ))}
      <div ref={ref} className="col-span-1" />
    </div>
  );
}
