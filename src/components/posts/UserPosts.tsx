"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { Product } from "@prisma/client";
import { TProductWithCategory } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import { useUserStore } from "@/store/userStore";

const UserPosts = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) {
        return [];
      }
      const response = await axios.get(`/api/posts`);
      return response.data;
    },
    enabled: !!currentUser?.id,
  });

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col space-y-3 justify-center items-center"
          >
            <Skeleton className="md:h-[150px] h-[300px] md:w-[150px] w-[300px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="md:h-4 h-6 md:w-[100px] w-[250px]" />
              <Skeleton className="md:h-4 h-6 md:w-[50px] w-[200px]" />
              <Skeleton className="md:h-4 h-6 md:w-[150px] w-[300px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState title="게시물이 없습니다" subtitle="게시물을 작성해보세요!" />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {products?.map((product: Product) => (
          <ProductCard
            key={product.id}
            data={product as TProductWithCategory}
          />
        ))}
      </div>
    </>
  );
};

export default UserPosts;
