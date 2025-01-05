import { TConversation } from "@/types";

interface UseLatestMessageProps {
  conversations: TConversation[];
  currentUserId: string;
}

export const useLatestMessage = ({
  conversations,
  currentUserId,
}: UseLatestMessageProps) => {
  const messagesWithCurrentUser = conversations.find((conversation) =>
    conversation.users.find((user) => user.id === currentUserId)
  );

  return messagesWithCurrentUser?.messages.slice(-1)[0];
};
