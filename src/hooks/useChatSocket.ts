import { useSocket } from "@/components/providers/SocketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  useEffect(() => {
    if (!socket) return;

    // chat 페이지나 쿼리 파라미터가 있는 경우에만 소켓 이벤트 리스너 등록
    const isChatPage = pathname === "/chat";

    if (!isChatPage) return;

    // 메시지 업데이트 이벤트 리스너
    socket.on(updateKey, (message: any) => {
      try {
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }

          const newData = oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.map((item: any) =>
              item.id === message.id ? message : item
            ),
          }));

          return {
            ...oldData,
            pages: newData,
          };
        });
      } catch (error) {
        console.error("소켓 이벤트 처리 오류", error);
        toast.error("소켓 이벤트 처리 오류");
      }
    });

    // 새 메시지 추가 이벤트 리스너
    socket.on(addKey, (message: any) => {
      try {
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  items: [message],
                },
              ],
            };
          }

          const newData = [...oldData.pages];
          newData[0] = {
            ...newData[0],
            items: [message, ...newData[0].items],
          };

          return {
            ...oldData,
            pages: newData,
          };
        });
      } catch (error) {
        console.error("소켓 이벤트 처리 오류", error);
        toast.error("소켓 이벤트 처리 오류");
      }
    });

    const handleReconnect = () => {
      if (isConnected) {
        queryClient.invalidateQueries({ queryKey });
      }
    };

    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off(updateKey);
      socket.off(addKey);
      socket.off("reconnect", handleReconnect);
    };
  }, [queryClient, queryKey, addKey, updateKey, socket, isConnected]);
};
