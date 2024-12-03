"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { User } from "@prisma/client";
import Chat from "@/components/chat/Chat";
import { TUserWithChat } from "@/types/indes";

import Contacts from "@/components/chat/Contacts";

interface ChatClientProps {
  currentUser?: User | null;
}

const ChatClient = ({ currentUser }: ChatClientProps) => {
  const [receiver, setReceiver] = useState({
    receiverId: "",
    receiverName: "",
    receiverImage: "",
  });

  // useEffect(() => {
  //   axios.get(`/api/chat`);
  // }, []);

  const [layout, setLayout] = useState(false);

  const fetcher = (url: string) => {
    return axios.get(url).then((res) => res.data);
  };

  const {
    data: users,
    error,
    isLoading,
  } = useSWR(`/api/chat`, fetcher, {
    refreshInterval: 1000,
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
