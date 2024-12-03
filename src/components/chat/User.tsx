import { fromNow } from "@/helpers/dayjs";
import { TConversation, TUserWithChat } from "@/types/indes";

import Avatar from "@/components/common/Avatar";

interface UserProps {
  user: TUserWithChat;
  currentUserId: string;
}

const User = ({ user, currentUserId }: UserProps) => {
  const messagesWithCurrentUser = user.conversations.find(
    (conversation: TConversation) =>
      conversation.users.find((user) => user.id === currentUserId)
  );

  const latestMessage = messagesWithCurrentUser?.messages.slice(-1)[0];

  return (
    <div
      className="grid grid-cols-[40px_1fr_50px] grid-rows-[40px] gap-3 py-3 px-4
  border-b-[1px] hover:cursor-pointer hover:bg-rose-400"
    >
      <div>
        <Avatar src={user.image} />
      </div>
      <div>
        <h3 className="overflow-hidden text-base font-medium">{user.name}</h3>
        {latestMessage && (
          <p className="overflow-hidden text-xs font-medium text-gray-600 break-words whitespace-pre-wrap">
            {latestMessage.text}
          </p>
        )}
        {latestMessage && latestMessage.image && (
          <p className="text-xs font-medium text-gray-600">[이미지]</p>
        )}
      </div>
      <div className="flex justify-end text-xs text-gray-500">
        {latestMessage && <p>{fromNow(latestMessage?.createdAt)}</p>}
      </div>
    </div>
  );
};

export default User;
