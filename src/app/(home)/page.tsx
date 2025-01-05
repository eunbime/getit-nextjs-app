import { FaPlus } from "react-icons/fa";

import getCurrentUser from "../actions/getCurrentUser";
import { SearchParams } from "@/hooks/api/useProducts";
import Container from "@/components/common/Container";
import Categories from "@/components/categories/Categories";
import Products from "@/components/products/Product";
import Sidebar from "@/components/navigation/Sidebar";
import FloatingButton from "@/components/common/FloatingButton";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: SearchParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const currentUser = await getCurrentUser();

  return (
    <Container>
      <Categories />
      <div className="flex flex-col md:flex-row w-full">
        {Object.keys(searchParams).length !== 0 && <Sidebar />}
        <Products searchParams={searchParams} currentUser={currentUser} />
      </div>
      <FloatingButton currentUser={currentUser} href="/products/upload">
        <FaPlus />
      </FloatingButton>
    </Container>
  );
}
