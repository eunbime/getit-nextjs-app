import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { prefetchPopularProducts } from "@/hooks/product/usePopularProducts";
import BestProductsCarousel from "@/components/carousel/BestProductsCarousel";

export default async function PopularProducts() {
  const queryClient = new QueryClient();

  await prefetchPopularProducts(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BestProductsCarousel />
    </HydrationBoundary>
  );
}
