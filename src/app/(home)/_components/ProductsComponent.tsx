import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { prefetchProducts, SearchParams } from "@/hooks/product/useProducts";
import Products from "@/components/products/Product";
import Sidebar from "@/components/navigation/Sidebar";
import { CategoryType } from "@/constants/categories";

interface ProductsComponentProps {
  searchParams: SearchParams;
}

export default async function ProductsComponent({
  searchParams,
}: ProductsComponentProps) {
  const queryClient = new QueryClient();
  const category = searchParams?.category as CategoryType;

  await prefetchProducts(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col md:flex-row w-full">
        {Object.keys(searchParams).length !== 0 && (
          <Sidebar category={category} />
        )}
        <Products />
      </div>
    </HydrationBoundary>
  );
}
