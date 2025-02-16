import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { prefetchLatestProducts } from "@/hooks/product/useLatestProducts";

export const LatestProductsSkeleton = () => (
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
);

const LatestProductsCarousel = dynamic(
  () => import("@/components/carousel/LatestProductsCarousel"),
  {
    ssr: false,
    loading: () => <LatestProductsSkeleton />,
  }
);

export default async function LatestProducts() {
  const queryClient = new QueryClient();
  await prefetchLatestProducts(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LatestProductsCarousel />
    </HydrationBoundary>
  );
}
