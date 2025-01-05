import { useEffect, useState } from "react";

interface UseChatScrollProps {
  containerRef: React.RefObject<HTMLDivElement>;
  isFetchingNextPage: boolean;
  data: any;
  messageEndRef: React.RefObject<HTMLDivElement>;
}

export const useChatScroll = ({
  containerRef,
  isFetchingNextPage,
  data,
  messageEndRef,
}: UseChatScrollProps) => {
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messageEndRef?.current?.scrollIntoView({
      behavior: "instant",
    });
  };

  // 무한스크롤 시 스크롤 처리
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
  }, [containerRef, isFetchingNextPage]);

  // 새 메시지가 추가될 때 스크롤 처리
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

  return {
    messageEndRef,
    lastMessageId,
    setLastMessageId,
    scrollToBottom,
  };
};
