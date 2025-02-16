import { Metadata } from "next";
import { FaPlus } from "react-icons/fa";
import { Suspense } from "react";

import { SearchParams } from "@/hooks/product/useProducts";
import CategoriesComponent from "@/app/(home)/_components/CategoriesComponent";
import LatestProducts, {
  LatestProductsSkeleton,
} from "@/app/(home)/_components/LatestProducts";
import PopularProducts from "@/app/(home)/_components/PopularProducts";
import ProductsComponent from "@/app/(home)/_components/ProductsComponent";
import Container from "@/components/common/Container";
import FloatingButton from "@/components/common/FloatingButton";
import { ProductsSkeleton } from "@/components/products/Product";

interface HomeProps {
  searchParams: SearchParams;
}

export const metadata: Metadata = {
  title: "GETIT 마켓",
  description: "GETIT 중고거래 마켓입니다.",
};

export default async function Home({ searchParams }: HomeProps) {
  return (
    <Container>
      {Object.keys(searchParams).length === 0 && (
        <>
          <div className="flex flex-col gap-10 my-16">
            <h2 className="relative text-2xl font-bold w-fit">
              <span className="text-[#0d0c8f] font-extrabold">GET!T</span>에서
              주목받고 있는 물품
              <div className="absolute top-[50%] left-0 bg-gray-200 w-full h-4 -z-10" />
            </h2>
            <Suspense
              fallback={
                <div className="w-full h-[380px] bg-gray-200 animate-pulse flex items-center justify-center" />
              }
            >
              <PopularProducts />
            </Suspense>
          </div>
          <div className="flex flex-col gap-10 my-16">
            <h2 className="relative text-2xl font-bold w-fit">
              <span className="text-[#0d0c8f] font-extrabold">GET!T</span>에
              새로 올라온 물품
              <div className="absolute top-[50%] left-0 bg-gray-200 w-full h-4 -z-10" />
            </h2>
            <Suspense fallback={<LatestProductsSkeleton />}>
              <LatestProducts />
            </Suspense>
          </div>
        </>
      )}

      <CategoriesComponent />
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsComponent searchParams={searchParams} />
      </Suspense>
      <FloatingButton href="/products/upload">
        <FaPlus />
      </FloatingButton>
    </Container>
  );
}
