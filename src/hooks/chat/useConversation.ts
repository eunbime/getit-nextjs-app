import { TConversation, TUserWithChat } from "@/types";

interface UseConversationProps {
  currentUser: TUserWithChat;
  receiverId: string;
}

export const useConversation = ({
  currentUser,
  receiverId,
}: UseConversationProps) => {
  return currentUser?.conversations.find((conversation: TConversation) => {
    return conversation.users.find((user) => user.id === receiverId);
  });
};
