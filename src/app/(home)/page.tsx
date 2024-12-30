import getCurrentUser from "../actions/getCurrentUser";
import getProducts, { ProductsParams } from "../actions/getProducts";

import Container from "@/components/common/Container";
import EmptyState from "@/components/EmptyState";
import Categories from "@/components/categories/Categories";
import Products from "@/components/products/Product";
import Sidebar from "@/components/navigation/Sidebar";
import FloatingButton from "@/components/common/FloatingButton";

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
      <div className="flex flex-col md:flex-row w-full">
        {Object.keys(searchParams).length !== 0 && <Sidebar />}
        {products?.data.length === 0 ? (
          <EmptyState showReset />
        ) : (
          <Products searchParams={searchParams} currentUser={currentUser} />
        )}
      </div>
      <FloatingButton currentUser={currentUser} href="/products/upload">
        +
      </FloatingButton>
    </Container>
  );
}
