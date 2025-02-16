"use client";

import LoadingCards from "@/components/products/LoadingCards";
import EmptyState from "@/components/EmptyState";
import ProductList from "@/components/products/ProductList";
import { SearchParams, useProducts } from "@/hooks/product/useProducts";

interface ProductsProps {
  searchParams: SearchParams;
}

const Products: React.FC<ProductsProps> = ({ searchParams }) => {
  const {
    data: products,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts(searchParams);

  if (error) {
    return <div>상품을 불러오는데 실패했습니다.</div>;
  }

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {Array.from({ length: 20 }).map((_, index) => (
          <LoadingCards key={index} />
        ))}
      </div>
    );
  }

  if (products?.pages[0].data.length === 0) {
    if (!Object.keys(searchParams)[1]) {
      return <EmptyState showReset />;
    }
    return <EmptyState showCategoryReset params={searchParams.category} />;
  }

  return (
    <div className="flex flex-col w-full">
      <ProductList
        products={products}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        searchParams={searchParams}
      />
    </div>
  );
};

export default Products;
