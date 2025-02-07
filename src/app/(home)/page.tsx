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
import LatestProductsCarousel from "@/components/carousel/LatestProductsCarousel";
import BestProductsCarousel from "@/components/carousel/BestProductsCarousel";

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
        {Object.keys(searchParams).length === 0 && (
          <>
            <div className="flex flex-col gap-10 my-16">
              <h2 className="relative text-2xl font-bold w-fit">
                <span className="text-[#0d0c8f] font-extrabold">GET!T</span>에서
                주목받고 있는 물품
                <div className="absolute top-[50%] left-0 bg-gray-200 w-full h-4 -z-10" />
              </h2>
              <BestProductsCarousel />
            </div>
            <div className="flex flex-col gap-10 my-16">
              <h2 className="relative text-2xl font-bold w-fit">
                <span className="text-[#0d0c8f] font-extrabold">GET!T</span>에
                새로 올라온 물품
                <div className="absolute top-[50%] left-0 bg-gray-200 w-full h-4 -z-10" />
              </h2>
              <LatestProductsCarousel />
            </div>
          </>
        )}

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
