"use client";

import { Product, User } from "@prisma/client";
import ProductCard from "../products/ProductCard";
import { TProductWithCategory } from "@/types";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface UserPostsProps {
  products: Product[];
  currentUser: User | null;
}

const UserPosts = ({ products, currentUser }: UserPostsProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [products]);

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {[...Array(8)].map((_, index) => (
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

  return (
    <div className="grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {products.map((product: Product) => (
        <ProductCard
          key={product.id}
          data={product as TProductWithCategory}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

export default UserPosts;
