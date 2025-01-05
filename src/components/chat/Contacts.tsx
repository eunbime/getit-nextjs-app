import { TUserWithChat } from "@/types/index";
import { Receiver } from "@/app/chat/ChatClient";
import User from "@/components/chat/User";

interface ContactsProps {
  users: TUserWithChat[];
  currentUser: TUserWithChat;
  setLayout: (layout: boolean) => void;
  setReceiver: (receiver: Receiver) => void;
}

const Contacts = ({
  users,
  currentUser,
  setLayout,
  setReceiver,
}: ContactsProps) => {
  const filterMessages = (user: TUserWithChat) => {
    setReceiver({
      receiverId: user.id,
      receiverName: user.name || "",
      receiverImage: user.image || "",
    });
    setLayout(true);
  };

  return (
    <nav
      className="w-full overflow-auto h-[calc(100vh_-_56px)] border-[1px]"
      aria-label="Chat Contacts"
    >
      <h1 className="m-4 text-2xl font-semibold">Chat</h1>

      <hr />

      <ul className="flex flex-col">
        {users?.length > 0 &&
          users
            .filter((user) => user.id !== currentUser?.id)
            .map((user) => {
              return (
                <li key={user.id} onClick={() => filterMessages(user)}>
                  <User user={user} currentUserId={currentUser?.id} />
                </li>
              );
            })}
      </ul>
    </nav>
  );
};

export default Contacts;
