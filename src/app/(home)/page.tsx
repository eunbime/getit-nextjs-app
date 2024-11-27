import { Product } from "@prisma/client";
import getCurrentUser from "../actions/getCurrentUser";
import getProducts, { ProductsParams } from "../actions/getProducts";

import Container from "@/components/common/Container";
import EmptyState from "@/components/EmptyState";
import FloatingButton from "@/components/common/FloatingButton";
import ProductCard from "@/components/products/ProductCard";

interface HomeProps {
  searchParams: ProductsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const products = await getProducts(searchParams);
  const currentUser = await getCurrentUser();

  console.log(products);

  return (
    <Container>
      {/* Categories */}

      {products?.data.length === 0 ? (
        <EmptyState showReset />
      ) : (
        <>
          <div
            className="grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3
          lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5"
          >
            {products?.data.map((product: Product) => (
              <ProductCard
                key={product.id}
                data={product}
                currentUser={currentUser}
              />
            ))}
          </div>

          {/* Pagination */}

          {/* FloatingButton */}
          <FloatingButton href="/products/upload">+</FloatingButton>
        </>
      )}
    </Container>
  );
}
