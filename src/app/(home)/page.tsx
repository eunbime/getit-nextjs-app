import getCurrentUser from "../actions/getCurrentUser";
import getProducts, { ProductsParams } from "../actions/getProducts";

import Container from "@/components/common/Container";
import EmptyState from "@/components/EmptyState";
import Categories from "@/components/categories/Categories";
import Products from "@/components/products/Product";
import Sidebar from "@/components/navigation/Sidebar";
import FloatingButton from "@/components/common/FloatingButton";
import { FaPlus } from "react-icons/fa";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: ProductsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const products = await getProducts(searchParams);
  const currentUser = await getCurrentUser();

  console.log("product", Object.keys(searchParams).length === 0);

  return (
    <Container>
      <Categories />
      <div className="flex flex-col md:flex-row w-full">
        {Object.keys(searchParams).length !== 0 && <Sidebar />}
        {products?.data.length > 0 ? (
          <Products searchParams={searchParams} currentUser={currentUser} />
        ) : Object.keys(searchParams).length === 0 ? (
          <EmptyState
            title="게시물이 없습니다."
            subtitle="첫 게시물을 작성해주세요."
          />
        ) : (
          <EmptyState showReset />
        )}
      </div>
      <FloatingButton currentUser={currentUser} href="/products/upload">
        <FaPlus />
      </FloatingButton>
    </Container>
  );
}
