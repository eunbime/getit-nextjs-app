"use client";

import { useState } from "react";
import axios from "axios";
import { User } from "@prisma/client";
import Chat from "@/components/chat/Chat";
import { TUserWithChat } from "@/types/index";

import Contacts from "@/components/chat/Contacts";
import { useQuery } from "@tanstack/react-query";

interface ChatClientProps {
  currentUser?: User | null;
}

const ChatClient = ({ currentUser }: ChatClientProps) => {
  const [receiver, setReceiver] = useState({
    receiverId: "",
    receiverName: "",
    receiverImage: "",
  });
  const [layout, setLayout] = useState(false);

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chat"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/chat`);
      return data;
    },
  });

  const currentUserWithMessage = users?.find(
    (user: TUserWithChat) => user.email === currentUser?.email
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error!!!</p>;

  return (
    <main>
      <div className="grid grid-cols-[1fr] md:grid-cols-[300px_1fr]">
        <section className={`md:flex ${layout && "hidden"}`}>
          <Contacts
            users={users}
            currentUser={currentUserWithMessage}
            setLayout={setLayout}
            setReceiver={setReceiver}
          />
        </section>
        <section className={`md:flex ${!layout && "hidden"}`}>
          <Chat
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
