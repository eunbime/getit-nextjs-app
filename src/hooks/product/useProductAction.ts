import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UseProductActionProps {
  product: any;
  currentUser?: User | null;
  productId?: string;
}

export const useProductAction = ({
  product,
  currentUser,
  productId,
}: UseProductActionProps) => {
  const router = useRouter();

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
      toast.success("상품이 삭제되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("상품 삭제 중 오류 발생:", error);
      toast.error("상품 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateClick = async () => {
    try {
      router.push(`/products/upload?productId=${productId}`);
      toast.success("상품 수정 페이지로 이동합니다.");
    } catch (error) {
      console.error("상품 수정 중 오류 발생:", error);
      toast.error("상품 수정 중 오류가 발생했습니다.");
    }
  };

  return {
    handleChatClick,
    handleDeleteClick,
    handleUpdateClick,
  };
};
