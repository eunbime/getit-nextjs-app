import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UseProductActionProps {
  productId?: string;
}

export const useProductAction = ({ productId }: UseProductActionProps) => {
  const router = useRouter();

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
    handleDeleteClick,
    handleUpdateClick,
  };
};
