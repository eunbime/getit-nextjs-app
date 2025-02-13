import { useUserStore } from "@/store/userStore";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UseOpenChatProps {
  user?: User | null;
}

export const useOpenChat = ({ user }: UseOpenChatProps) => {
  const router = useRouter();
  const { currentUser } = useUserStore();

  const handleOpenChat = async () => {
    console.log(currentUser?.id, user?.id);
    if (!currentUser) {
      toast.warn("로그인 후 이용해주세요");
      return;
    }

    if (currentUser?.id === user?.id) {
      toast.warn("자신과 채팅할 수 없습니다.");
      return;
    }

    try {
      const response = await axios.get(
        `/api/chat/check?senderId=${currentUser?.id}&receiverId=${user?.id}`
      );
      const conversationExists = response.data.exists;

      if (conversationExists) {
        router.push(
          `/chat?id=${user?.id}&name=${user?.name}&image=${user?.image}&open=true`
        );
        return;
      } else {
        await axios.post("/api/chat", {
          senderId: currentUser?.id,
          receiverId: user?.id,
        });

        const userImage = user?.image ? user?.image : "";

        router.push(
          `/chat?id=${user?.id}&name=${user?.name}&image=${userImage}&open=true`
        );
      }
    } catch (error) {
      console.error("채팅 시작 중 오류 발생:", error);
      toast.error("채팅 시작 중 오류 발생했습니다.");
    }
  };

  return { handleOpenChat };
};
