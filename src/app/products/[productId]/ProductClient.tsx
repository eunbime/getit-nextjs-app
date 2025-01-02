"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

import { Category, Subcategory, User } from "@prisma/client";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import ProductHead from "@/components/products/ProductHead";
import ProductInfo from "@/components/products/ProductInfo";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductClientProps {
  productId: string;
  currentUser?: User | null;
}

const ProductClient = ({ productId, currentUser }: ProductClientProps) => {
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/categories");
      return data;
    },
  });

  const { data: subCategory, isLoading: subCategoriesLoading } =
    useQuery<Subcategory>({
      queryKey: ["subCategory", productId],
      queryFn: async () => {
        const { data } = await axios.get(
          `/api/categories/sub-categories/${productId}`
        );
        return data[0];
      },
      enabled: !!productId,
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
    loading: () => <p>카카오맵 로딩중...</p>,
  });

  const category = categories?.find((item) => item.id === product?.categoryId);

  const handleChatClick = async () => {
    if (!currentUser) {
      toast.warning("로그인 후 이용해주세요");
      return;
    }

    try {
      // 새로운 대화 생성 또는 기존 대화 확인
      await axios.post("/api/chat", {
        senderId: currentUser?.id,
        receiverId: product?.user?.id,
        text: `안녕하세요. ${product.title} 상품에 대해 문의드립니다.`,
      });

      const userImage = product?.user?.image ? product?.user?.image : "";

      router.push(
        `/chat?id=${product?.user?.id}&name=${product?.user?.name}&image=${userImage}&open=true`
      );
    } catch (error) {
      console.error("채팅 시작 중 오류 발생:", error);
      toast.error("채팅 시작 중 오류 발생했습니다.");
    }
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`/api/products/${productId}`);
      router.push("/");
    } catch (error) {
      console.error("상품 삭제 중 오류 발생:", error);
      toast.error("상품 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateClick = async () => {
    try {
      router.push(`/products/upload?productId=${productId}`);
    } catch (error) {
      console.error("상품 수정 중 오류 발생:", error);
      toast.error("상품 수정 중 오류가 발생했습니다.");
    }
  };

  if (error) {
    return <div>상품 로딩 중 오류가 발생했습니다.</div>;
  }

  if (isLoading || categoriesLoading || subCategoriesLoading) {
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
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 mt-6 md:grid-cols-2 md:gap-10 w-full mb-10">
            <ProductInfo
              user={product?.user}
              category={category}
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
