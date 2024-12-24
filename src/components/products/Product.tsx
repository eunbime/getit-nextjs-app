"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "@prisma/client";
import { TProductWithCategory } from "@/types";
import EmptyState from "../EmptyState";
import ProductCard from "./ProductCard";
import FloatingButton from "../common/FloatingButton";

interface ProductsProps {
  searchParams: any;
  currentUser: any;
}

const Products: React.FC<ProductsProps> = ({ searchParams, currentUser }) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", searchParams],
    queryFn: async () => {
      const { data } = await axios.get("/api/products", {
        params: searchParams,
      });
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (products?.data.length === 0) {
    return <EmptyState showReset />;
  }

  return (
    <>
      <div
        className="grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3
        lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5"
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
