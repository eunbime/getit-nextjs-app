"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { User } from "@prisma/client";
import { SearchParams, useProducts } from "@/hooks/api/useProducts";
import LoadingCards from "@/components/products/LoadingCards";
import EmptyState from "@/components/EmptyState";
import ProductList from "@/components/products/ProductList";

interface ProductsProps {
  searchParams: SearchParams;
  currentUser?: User | null;
}

const Products: React.FC<ProductsProps> = ({ searchParams, currentUser }) => {
  const [ref, inView] = useInView();

  const {
    data: products,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts(searchParams);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (error) {
    return <div>상품을 불러오는데 실패했습니다.</div>;
  }

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
      <ProductList products={products} currentUser={currentUser} />
      <div ref={ref} className="flex w-full justify-center p-4">
        {isFetchingNextPage && <LoadingCards searchParams={searchParams} />}
      </div>
    </div>
  );
};

export default Products;
