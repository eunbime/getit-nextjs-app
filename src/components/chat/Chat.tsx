"use client";

import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

import { Message as MessageType } from "@prisma/client";
import { TUserWithChat } from "@/types/index";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import Input from "./Input";
import { useChatQuery } from "@/hooks/chat/useChatQuery";
import { useChatSocket } from "@/hooks/chat/useChatSocket";
import { Receiver } from "@/app/chat/ChatClient";
import { useChatScroll } from "@/hooks/chat/useChatScroll";
import { useConversation } from "@/hooks/chat/useConversation";

interface ChatProps {
  receiver: Receiver;
  currentUser: TUserWithChat;
  setLayout: (layout: boolean) => void;
}

const Chat = ({ receiver, currentUser, setLayout }: ChatProps) => {
  const { ref, inView } = useInView();
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    currentUser,
    receiverId: receiver.receiverId,
  });

  // 실시간 메시지 업데이트를 위한 소켓 설정
  const queryKey = `chat:${conversation?.id}`;
  const addKey = `chat:${conversation?.id}:messages`;
  const updateKey = `chat:${conversation?.id}:messages:update`;

  useChatSocket({
    addKey,
    updateKey,
    queryKey,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useChatQuery({
      queryKey,
      apiUrl: "/api/socket/messages",
      paramKey: "conversationId",
      paramValue: conversation?.id || "",
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useChatScroll({
    containerRef,
    isFetchingNextPage,
    data,
    messageEndRef,
  });

  if (!receiver.receiverName || !currentUser) {
    return <div className="w-full h-full" />;
  }

  if (error) {
    return <div>채팅 불러오기 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="w-full">
      <div>
        <ChatHeader
          setLayout={setLayout}
          receiverImage={receiver.receiverImage}
          receiverName={receiver.receiverName}
          lastMessageTime={
            conversation?.messages
              .filter((message) => message.receiverId === currentUser.id)
              .slice(-1)[0]?.createdAt
          }
        />
      </div>

      <div
        ref={containerRef}
        className="flex flex-col gap-8 overflow-auto h-[calc(100vh_-_60px_-_70px_-_80px)] px-5 pt-5"
      >
        {hasNextPage && (
          <div ref={ref} className="flex justify-center py-2 mb-4">
            {isFetchingNextPage && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
            )}
          </div>
        )}

        {data?.pages
          .slice()
          .reverse()
          .map((page, i) => (
            <div key={i} className="flex flex-col gap-4">
              {page.items
                .slice()
                .reverse()
                .map((item: MessageType) => (
                  <Message
                    key={item.id}
                    isSender={item.senderId === currentUser.id}
                    messageText={item.text}
                    messageImage={item.image}
                    receiverName={receiver.receiverName}
                    receiverImage={receiver.receiverImage}
                    senderImage={currentUser?.image}
                    time={item.createdAt}
                  />
                ))}
            </div>
          ))}

        <div ref={messageEndRef} />
      </div>

      <div className="flex items-center p-3">
        <Input
          receiverId={receiver?.receiverId}
          currentUserId={currentUser?.id}
          apiUrl="/api/socket/messages"
        />
      </div>
    </div>
  );
};

export default Chat;
