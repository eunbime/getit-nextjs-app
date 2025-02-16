import { Metadata } from "next";
import { FaPlus } from "react-icons/fa";

import { SearchParams } from "@/hooks/product/useProducts";
import CategoriesComponent from "@/app/(home)/_components/CategoriesComponent";
import LatestProducts from "@/app/(home)/_components/LatestProducts";
import PopularProducts from "@/app/(home)/_components/PopularProducts";
import Container from "@/components/common/Container";
import FloatingButton from "@/components/common/FloatingButton";
import ProductsComponent from "./_components/ProductsComponent";

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
            <PopularProducts />
          </div>
          <div className="flex flex-col gap-10 my-16">
            <h2 className="relative text-2xl font-bold w-fit">
              <span className="text-[#0d0c8f] font-extrabold">GET!T</span>에
              새로 올라온 물품
              <div className="absolute top-[50%] left-0 bg-gray-200 w-full h-4 -z-10" />
            </h2>
            <LatestProducts />
          </div>
        </>
      )}

      <CategoriesComponent />
      <ProductsComponent searchParams={searchParams} />
      <FloatingButton href="/products/upload">
        <FaPlus />
      </FloatingButton>
    </Container>
  );
}
