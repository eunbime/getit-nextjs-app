import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import ProductClient from "@/app/products/[productId]/ProductClient";
import { prefetchProductById } from "@/hooks/product/useProductById";

interface Params {
  productId?: string;
}

const ProductIdPage = async ({ params }: { params: Params }) => {
  const queryClient = new QueryClient();
  const productId = params.productId;

  await prefetchProductById(queryClient, productId);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductClient productId={productId} />
    </HydrationBoundary>
  );
};

export default ProductIdPage;
