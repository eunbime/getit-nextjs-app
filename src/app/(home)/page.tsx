import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { Suspense } from "react";

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
import BestProductsCarousel from "@/components/carousel/BestProductsCarousel";
import LatestProducts from "./_components/LatestProducts";
import { Metadata } from "next";

interface HomeProps {
  searchParams: SearchParams;
}

export const metadata: Metadata = {
  title: "GET!T 마켓",
  description: "GET!T 중고거래 마켓입니다.",
};

export const dynamic = "force-dynamic"; // SSR 강제 적용

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

  await queryClient.prefetchQuery({
    queryKey: ["popular-products"],
    queryFn: async () => {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${baseUrl}/api/posts/popular`);
      return response.data;
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
              <Suspense fallback={<div>Loading...</div>}>
                <BestProductsCarousel />
              </Suspense>
            </div>
            <div className="flex flex-col gap-10 my-16">
              <h2 className="relative text-2xl font-bold w-fit">
                <span className="text-[#0d0c8f] font-extrabold">GET!T</span>에
                새로 올라온 물품
                <div className="absolute top-[50%] left-0 bg-gray-200 w-full h-4 -z-10" />
              </h2>

              <Suspense
                fallback={
                  <div className="flex gap-[50px]">
                    <div className="hidden md:block animate-pulse flex-[0_0_calc(25%-37.5px)]">
                      <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4" />
                    </div>
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse flex-[0_0_calc(33.333%-33.333px)] md:flex-[0_0_calc(25%-37.5px)]"
                      >
                        <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4" />
                      </div>
                    ))}
                  </div>
                }
              >
                <LatestProducts />
              </Suspense>
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
