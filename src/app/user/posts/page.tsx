import getCurrentUser from "@/app/actions/getCurrentUser";
import getProductsByUserId from "@/app/actions/getProductsByUserId";
import ProductCard from "@/components/products/ProductCard";
import { TProductWithCategory } from "@/types";
import { Product } from "@prisma/client";

export default async function UserPosts() {
  const currentUser = await getCurrentUser();

  const products = await getProductsByUserId(currentUser?.id as string);

  return (
    <section className="flex-1 p-8">
      <h1 className="text-2xl font-semibold mb-8">내 게시물</h1>
      <div className="grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {products.map((product: Product) => (
          <ProductCard
            key={product.id}
            data={product as TProductWithCategory}
            currentUser={currentUser}
          />
        ))}
      </div>
    </section>
  );
}
