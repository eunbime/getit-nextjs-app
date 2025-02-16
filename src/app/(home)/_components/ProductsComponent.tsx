import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { prefetchProducts, SearchParams } from "@/hooks/product/useProducts";
import Products from "@/components/products/Product";
import Sidebar from "@/components/navigation/Sidebar";

interface ProductsComponentProps {
  searchParams: SearchParams;
}

export default async function ProductsComponent({
  searchParams,
}: ProductsComponentProps) {
  const queryClient = new QueryClient();

  await prefetchProducts(queryClient, searchParams);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col md:flex-row w-full">
        {Object.keys(searchParams).length !== 0 && <Sidebar />}
        <Products searchParams={searchParams} />
      </div>
    </HydrationBoundary>
  );
}
