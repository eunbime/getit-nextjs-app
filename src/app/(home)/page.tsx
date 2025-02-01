import { FaPlus } from "react-icons/fa";

import { getProducts, SearchParams } from "@/hooks/api/useProducts";
import Container from "@/components/common/Container";
import Products from "@/components/products/Product";
import Sidebar from "@/components/navigation/Sidebar";
import FloatingButton from "@/components/common/FloatingButton";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CategoriesComponent from "./_components/CategoriesComponent";

interface HomeProps {
  searchParams: SearchParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["products", searchParams.category, searchParams.subcategory],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const data = await getProducts({
        ...searchParams,
        page: pageParam.toString(),
        limit: "10",
      });
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container>
        <CategoriesComponent />
        <div className="flex flex-col md:flex-row w-full">
          {Object.keys(searchParams).length !== 0 && <Sidebar />}
          <Products searchParams={searchParams} />
        </div>
        <FloatingButton href="/products/upload">
          <FaPlus />
        </FloatingButton>
      </Container>
    </HydrationBoundary>
  );
}
