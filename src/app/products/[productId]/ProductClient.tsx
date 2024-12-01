"use client";

import { categories } from "@/components/categories/Categories";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import ProductHead from "@/components/products/ProductHead";
import ProductInfo from "@/components/products/ProductInfo";
import { Product, User } from "@prisma/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

interface ProductClientProps {
  product: Product & {
    user: User;
  };
  currentUser?: User | null;
}

const ProductClient = ({ product, currentUser }: ProductClientProps) => {
  const router = useRouter();

  const category = categories.find((items) => items.path === product.category);

  const KakaoMap = dynamic(() => import("@/components/KakaoMap"), {
    ssr: false,
  });

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ProductHead
            title={product.title}
            imageSrc={product.imageSrc}
            id={product.id}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 mt-6 md:grid-cols-2 md:gap-10">
            <ProductInfo
              user={product.user}
              category={category}
              createdAt={product.createdAt}
              description={product.description}
            />

            {/* Kakao Map */}
            <div>
              <KakaoMap
                detailPage
                latitude={product.latitude}
                longitude={product.longitude}
              />
            </div>
          </div>

          {currentUser?.id !== product?.user?.id && (
            <div>
              <Button
                onClick={() =>
                  router.push(
                    `/chat?id=${product?.user?.id}&name=${product?.user?.name}&image=${product?.user?.image}`
                  )
                }
                label="이 유저와 채팅하기"
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ProductClient;
