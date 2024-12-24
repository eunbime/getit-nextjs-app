import { Product } from "@prisma/client";
import getCurrentUser from "../actions/getCurrentUser";
import getProducts, { ProductsParams } from "../actions/getProducts";

import Container from "@/components/common/Container";
import EmptyState from "@/components/EmptyState";
import FloatingButton from "@/components/common/FloatingButton";
import ProductCard from "@/components/products/ProductCard";
import Categories from "@/components/categories/Categories";
import { TProductWithCategory } from "@/types";
import Products from "@/components/products/Product";

interface HomeProps {
  searchParams: ProductsParams;
}

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: HomeProps) {
  const products = await getProducts(searchParams);
  const currentUser = await getCurrentUser();

  console.log("product", Object.keys(searchParams).length === 0);

  return (
    <Container>
      <Categories />

      {products?.data.length === 0 ? (
        <EmptyState showReset />
      ) : (
        <Products searchParams={searchParams} currentUser={currentUser} />
      )}
    </Container>
  );
}
