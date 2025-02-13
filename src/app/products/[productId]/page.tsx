import ProductClient from "@/app/products/[productId]/ProductClient";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";

interface Params {
  productId?: string;
}

const ProductIdPage = async ({ params }: { params: Params }) => {
  const queryClient = new QueryClient();
  const productId = params.productId;

  await queryClient.prefetchQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`,
        {
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductClient productId={productId} />
    </HydrationBoundary>
  );
};

export default ProductIdPage;
