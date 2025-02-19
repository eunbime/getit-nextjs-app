"use client";

import dynamic from "next/dynamic";

import { useUserStore } from "@/store/userStore";
import { useProductAction } from "@/hooks/product/useProductAction";
import { useProductWithCategory } from "@/hooks/product/useProductWithCategory";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import ProductHead from "@/components/products/ProductHead";
import ProductInfo from "@/components/products/ProductInfo";

interface ProductClientProps {
  productId?: string;
}

const KakaoMap = dynamic(() => import("@/components/KakaoMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-200 animate-pulse flex items-center justify-center">
      지도 로딩중...
    </div>
  ),
});

const ProductClient = ({ productId }: ProductClientProps) => {
  const currentUser = useUserStore((state) => state.currentUser);

  const { product, error, category, subCategory } = useProductWithCategory({
    productId,
  });

  const { deleteProduct, handleUpdateClick } = useProductAction({
    productId,
  });

  const isValidLocation =
    product?.latitude &&
    product?.longitude &&
    !isNaN(Number(product.latitude)) &&
    !isNaN(Number(product.longitude));

  if (error) {
    return <div>상품 로딩 중 오류가 발생했습니다.</div>;
  }

  return (
    <Container>
      <div className="flex flex-col gap-6 mx-auto pt-14">
        <div className="flex flex-col gap-6 md:flex-row">
          <ProductHead
            title={product?.title}
            imageSrc={product?.imageSrc}
            id={product?.id}
          />
          <div className="w-full flex flex-col">
            <ProductInfo
              user={product?.user}
              category={category?.name}
              createdAt={product?.createdAt}
              price={product?.price}
              description={product?.description}
              subCategory={subCategory?.name}
            />
          </div>
        </div>
        <div className="w-full my-10">
          {isValidLocation ? (
            <KakaoMap
              detailPage
              latitude={Number(product?.latitude)}
              longitude={Number(product?.longitude)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              위치 정보를 불러올 수 없습니다.
            </div>
          )}
        </div>

        {currentUser?.id === product?.user?.id && (
          <div className="flex justify-end w-full mb-10">
            <div className="flex gap-2 w-full md:w-1/3">
              <Button onClick={() => deleteProduct()} label="삭제" />
              <Button onClick={handleUpdateClick} label="수정" />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ProductClient;
