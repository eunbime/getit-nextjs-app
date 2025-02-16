"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import { TUserWithChat } from "@/types/index";
import { useLayout } from "@/hooks/chat/useLayout";
import Contacts from "@/components/chat/Contacts";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/chat/LoadingSpinner";
import { useUserStore } from "@/store/userStore";
import { useChat } from "@/hooks/chat/useChat";

export interface Receiver {
  receiverId: string;
  receiverName: string;
  receiverImage: string;
}

const ChatClient = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  const searchParams = useSearchParams();
  const [receiver, setReceiver] = useState<Receiver>({
    receiverId: "",
    receiverName: "",
    receiverImage: "",
  });

  const { layout, setLayout } = useLayout({
    setReceiver,
    searchParams,
  });

  const { data: users, isLoading, error } = useChat();

  const currentUserWithMessage = users?.find(
    (user: TUserWithChat) => user.email === currentUser?.email
  );

  // 채팅 컴포넌트 동적 임포트
  const ChatComponent = dynamic(() => import("@/components/chat/Chat"), {
    loading: () => <div>Loading...</div>,
    ssr: false,
  });

  if (error) return <p>채팅 불러오기 중 오류가 발생했습니다.</p>;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 사용자가 없을 때 표시할 컴포넌트
  if (!users?.length) {
    return (
      <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center ">
        <EmptyState
          title="현재 진행 중인 채팅이 없습니다."
          subtitle="사용자와 채팅으로 소통해보세요."
        />
      </div>
    );
  }

  return (
    <main>
      <div className="grid grid-cols-[1fr] md:grid-cols-[300px_1fr]">
        <section className={`md:flex pt-14 ${layout && "hidden"}`}>
          <Contacts
            users={users}
            currentUser={currentUserWithMessage}
            setLayout={setLayout}
            setReceiver={setReceiver}
          />
        </section>
        <section className={`md:flex ${!layout && "hidden"}`}>
          <ChatComponent
            currentUser={currentUserWithMessage}
            receiver={receiver}
            setLayout={setLayout}
          />
        </section>
      </div>
    </main>
  );
};

export default ChatClient;
