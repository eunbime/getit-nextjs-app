"use client";

import dynamic from "next/dynamic";

import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import ProductHead from "@/components/products/ProductHead";
import ProductInfo from "@/components/products/ProductInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductAction } from "@/hooks/product/useProductAction";
import { useProduct } from "@/hooks/product/useProduct";
import { useUserStore } from "@/store/userStore";

interface ProductClientProps {
  productId?: string;
}

const ProductClient = ({ productId }: ProductClientProps) => {
  const currentUser = useUserStore((state) => state.currentUser);

  const { product, isLoading, error, category, subCategory } = useProduct({
    productId,
  });

  const { handleChatClick, handleDeleteClick, handleUpdateClick } =
    useProductAction({
      product,
      currentUser,
      productId,
    });

  const KakaoMap = dynamic(() => import("@/components/KakaoMap"), {
    ssr: false,
    loading: () => <p>카카오맵 로딩중...</p>,
  });

  if (error) {
    return <div>상품 로딩 중 오류가 발생했습니다.</div>;
  }

  if (isLoading) {
    return (
      <div className="w-full justify-center items-center">
        <div className="flex flex-col py-10 space-y-2 w-[90%] mx-auto">
          <Skeleton className="h-[30px] w-1/5 rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="flex flex-col md:flex-row items-center justify-center w-full gap-2">
            <Skeleton className="h-[300px] w-full md:w-1/2" />
            <Skeleton className="h-[300px] w-full md:w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ProductHead
            title={product?.title}
            imageSrc={product?.imageSrc}
            id={product?.id}
          />
          <div className="grid grid-cols-1 mt-6 md:grid-cols-2 gap-10 w-full mb-10">
            <ProductInfo
              user={product?.user}
              category={category?.name as string}
              createdAt={product?.createdAt}
              price={product?.price}
              description={product?.description}
              subCategory={subCategory?.name as string}
            />

            <div>
              <KakaoMap
                detailPage
                latitude={product?.latitude}
                longitude={product?.longitude}
              />
            </div>
          </div>

          {currentUser?.id !== product?.user?.id && (
            <div>
              <Button onClick={handleChatClick} label="이 유저와 채팅하기" />
            </div>
          )}
          {currentUser?.id === product?.user?.id && (
            <div className="flex gap-2">
              <Button onClick={handleDeleteClick} label="삭제" />
              <Button onClick={handleUpdateClick} label="수정" />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ProductClient;
