"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "@prisma/client";
import { TProductWithCategory } from "@/types";
import EmptyState from "../EmptyState";
import ProductCard from "./ProductCard";
import FloatingButton from "../common/FloatingButton";
import { Skeleton } from "../ui/skeleton";

interface ProductsProps {
  searchParams: any;
  currentUser: any;
}

const Products: React.FC<ProductsProps> = ({ searchParams, currentUser }) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", searchParams.category, searchParams.subcategory],
    queryFn: async () => {
      const { data } = await axios.get("/api/products", {
        params: searchParams,
      });
      return data;
    },
  });

  console.log(Object.keys(searchParams).length === 0);

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col space-y-3 justify-center items-center"
          >
            {Object.keys(searchParams).length === 0 ? (
              <>
                <Skeleton className="md:h-[250px] h-[300px] md:w-[250px] w-[350px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="md:h-4 h-6 md:w-[200px] w-[300px]" />
                  <Skeleton className="md:h-4 h-6 md:w-[150px] w-[250px]" />
                  <Skeleton className="md:h-4 h-6 md:w-[250px] w-[350px]" />
                </div>
              </>
            ) : (
              <>
                <Skeleton className="md:h-[200px] h-[300px] md:w-[200px] w-[350px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="md:h-4 h-6 md:w-[150px] w-[300px]" />
                  <Skeleton className="md:h-4 h-6 md:w-[100px] w-[250px]" />
                  <Skeleton className="md:h-4 h-6 md:w-[200px] w-[350px]" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (products?.data.length === 0) {
    return <EmptyState showReset />;
  }

  return (
    <>
      <div
        className="w-full grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3
        lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      >
        {products?.data.map((product: Product) => (
          <ProductCard
            key={product.id}
            data={product as TProductWithCategory}
            currentUser={currentUser}
          />
        ))}
      </div>

      <FloatingButton href="/products/upload">+</FloatingButton>
    </>
  );
};

export default Products;
