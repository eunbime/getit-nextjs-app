"use client";

import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Product } from "@prisma/client";
import { TProductWithCategory } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import LoadingCards from "@/components/products/LoadingCards";
import EmptyState from "../EmptyState";

interface ProductsProps {
  searchParams?: any;
  currentUser: any;
}

const Products: React.FC<ProductsProps> = ({ searchParams, currentUser }) => {
  const [ref, inView] = useInView();

  const {
    data: products,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", searchParams.category, searchParams.subcategory],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get("/api/products", {
        params: {
          ...searchParams,
          page: pageParam,
          limit: 10,
        },
      });
      return data;
    },
    getNextPageParam: (lastPage: any) => {
      if (lastPage.hasMore) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return <LoadingCards searchParams={searchParams} />;
  }

  if (products?.pages[0].data.length === 0) {
    if (!Object.keys(searchParams)[1]) {
      return <EmptyState showReset />;
    }
    return <EmptyState showCategoryReset params={searchParams.category} />;
  }

  return (
    <div className="flex flex-col w-full">
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
      <div ref={ref} className="flex w-full justify-center p-4">
        {isFetchingNextPage && <LoadingCards searchParams={searchParams} />}
      </div>
    </div>
  );
};

export default Products;
