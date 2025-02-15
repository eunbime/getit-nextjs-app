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

  // 통일성 유지 - hook으로 분리
  const { data: products, isLoading } = useQuery({
    // 쿼리키 규칙이 다소 아쉬움 
    // products 뒤의 아이디는 상품의 상세로 생각할 수 있음 
    // ["products", "user", currentUser?.id] 이렇게 하면 좋을 듯
    // 좋은 이유
    // 1. 계층 구조 명확: products(최상위 리소스 타입) -> user(필터링 기준) -> userId (구체적 식별자)
    // 2. 쿼리 무효화 적용 쉬움
    //    - 모든 제품 쿼리 무효화: queryClient.invalidateQueries(["products"])
    //    - 특정 사용자 제품 쿼리 무효화: queryClient.invalidateQueries(["products", "user", currentUser?.id])
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
