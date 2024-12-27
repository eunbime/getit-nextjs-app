"use client";

import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import ProductHead from "@/components/products/ProductHead";
import ProductInfo from "@/components/products/ProductInfo";
import { Category, User } from "@prisma/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ProductClientProps {
  productId: string;
  currentUser?: User | null;
}

const ProductClient = ({ productId, currentUser }: ProductClientProps) => {
  const router = useRouter();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/categories");
      return data;
    },
  });

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      return data;
    },
  });

  const KakaoMap = dynamic(() => import("@/components/KakaoMap"), {
    ssr: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading product</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const category = categories.find(
    (item: Category) => item.name === product.category
  );

  const handleChatClick = async () => {
    try {
      // 새로운 대화 생성 또는 기존 대화 확인
      const response = await axios.post("/api/chat", {
        senderId: currentUser?.id,
        receiverId: product?.user?.id,
        text: `안녕하세요. ${product.title} 상품에 대해 문의드립니다`,
      });

      const userImage = product?.user?.image ? product?.user?.image : "";

      // 채팅 페이지로 이동
      router.push(
        `/chat?id=${product?.user?.id}&name=${product?.user?.name}&image=${userImage}&open=true`
      );
      router.refresh();
    } catch (error) {
      console.error("채팅 시작 중 오류 발생:", error);
    }
  };

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
              <Button onClick={handleChatClick} label="이 유저와 채팅하기" />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ProductClient;
