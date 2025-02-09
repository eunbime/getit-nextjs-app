import LatestProductsCarousel from "@/components/carousel/LatestProductsCarousel";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";

export default async function LatestProducts() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["latest-products"],
    queryFn: async () => {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${baseUrl}/api/posts/latest`, {
        params: {
          limit: 10,
          page: 1,
        },
        headers: {
          "Cache-Control": "no-store",
        },
      });
      return response.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LatestProductsCarousel />
    </HydrationBoundary>
  );
}
