"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/products/ProductCard";
import { User } from "@prisma/client";

interface FavoritesListProps {
  currentUser?: User | null;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ currentUser }) => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const { data } = await axios.get("/api/favorites");
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <EmptyState
        title="오류가 발생했습니다"
        subtitle="잠시 후 다시 시도해주세요"
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="찜한 상품이 없습니다"
        subtitle="마음에 드는 상품을 찜해보세요!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {products.map((product: any) => (
        <ProductCard
          key={product.id}
          data={product}
          currentUser={currentUser ?? null}
        />
      ))}
    </div>
  );
};

export default FavoritesList;
