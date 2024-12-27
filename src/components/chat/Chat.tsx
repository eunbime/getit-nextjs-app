"use client";

import { useEffect, useRef } from "react";
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
  const conversation: TConversation | undefined =
    currentUser?.conversations.find((conversation: TConversation) => {
      return conversation.users.find((user) => user.id === receiver.receiverId);
    });

  const queryKey = `chat:${conversation?.id}`;
  const addKey = `chat:${conversation?.id}:messages`;
  const updateKey = `chat:${conversation?.id}:messages:update`;

  // useChatQuery로 메시지 데이터 가져오기
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl: "/api/socket/messages",
      paramKey: "conversationId",
      paramValue: conversation?.id || "",
    });

  console.log(data?.pages[0].items);

  // 실시간 메시지 업데이트를 위한 소켓 설정
  useChatSocket({
    addKey,
    updateKey,
    queryKey,
  });

  // 메시지 작성 시 자동 스크롤
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    messageEndRef?.current?.scrollIntoView({
      behavior: "instant",
    });
  };

  useEffect(() => {
    scrollToBottom();
  });

  if (!receiver.receiverName || !currentUser) {
    return <div className="w-full h-full"></div>;
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

      <div className="flex flex-col gap-8 overflow-auto h-[calc(100vh_-_60px_-_70px_-_80px)]">
        {data?.pages?.[0].items
          .slice()
          .reverse()
          .map((item: any) => (
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
