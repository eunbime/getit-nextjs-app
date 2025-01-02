"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

import { Message as MessageType } from "@prisma/client";
import { TConversation, TUserWithChat } from "@/types/index";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import Input from "./Input";
import { useChatQuery } from "@/hooks/useChatQuery";
import { useChatSocket } from "@/hooks/useChatSocket";

interface ChatProps {
  receiver: {
    receiverId: string;
    receiverName: string;
    receiverImage: string;
  };
  currentUser: TUserWithChat;
  setLayout: (layout: boolean) => void;
}

const Chat = ({ receiver, currentUser, setLayout }: ChatProps) => {
  const { ref, inView } = useInView();
  const containerRef = useRef<HTMLDivElement>(null);

  const conversation: TConversation | undefined =
    currentUser?.conversations.find((conversation: TConversation) => {
      return conversation.users.find((user) => user.id === receiver.receiverId);
    });

  const queryKey = `chat:${conversation?.id}`;
  const addKey = `chat:${conversation?.id}:messages`;
  const updateKey = `chat:${conversation?.id}:messages:update`;

  // 실시간 메시지 업데이트를 위한 소켓 설정
  useChatSocket({
    addKey,
    updateKey,
    queryKey,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatQuery(
    {
      queryKey,
      apiUrl: "/api/socket/messages",
      paramKey: "conversationId",
      paramValue: conversation?.id || "",
    }
  );

  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const scrollToBottom = () => {
    messageEndRef?.current?.scrollIntoView({
      behavior: "instant",
    });
  };

  // 이전 메시지 로드 시 스크롤 위치 유지
  useEffect(() => {
    const container = containerRef.current;
    if (container && isFetchingNextPage) {
      const scrollHeight = container.scrollHeight;

      const handleScroll = () => {
        const newScrollHeight = container.scrollHeight;
        const heightDifference = newScrollHeight - scrollHeight;
        container.scrollTop = heightDifference;
      };

      setTimeout(handleScroll, 0);
    }
  }, [isFetchingNextPage, data]);

  // 새 메시지가 추가될 때만 스크롤
  useEffect(() => {
    const lastPage = data?.pages[0];
    const firstMessage = lastPage?.items[0];

    if (firstMessage && (!lastMessageId || firstMessage.id !== lastMessageId)) {
      setLastMessageId(firstMessage.id);
      // 이전 메시지 로드가 아닌 새 메시지 추가일 때만 스크롤
      if (!isFetchingNextPage) {
        scrollToBottom();
      }
    }
  }, [data?.pages[0]?.items[0], isFetchingNextPage]);

  if (!receiver.receiverName || !currentUser) {
    return <div className="w-full h-full" />;
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
