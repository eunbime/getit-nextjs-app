import { TConversation, TUserWithChat } from "@/types/indes";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import Input from "./Input";

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
        <Message />
      </div>

      <div className="flex items-center p-3">
        <Input
          receiverId={receiver?.receiverId}
          currentUserId={currentUser?.id}
        />
      </div>
    </div>
  );
};

export default Chat;
