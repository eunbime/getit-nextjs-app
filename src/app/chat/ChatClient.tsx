"use client";

import { User } from "@prisma/client";
import { useState } from "react";

interface ChatClientProps {
  currentUser?: User | null;
}

const ChatClient = ({ currentUser }: ChatClientProps) => {
  const [receiver, serReceiver] = useState({
    receiverId: "",
    receiverName: "",
    receiverImage: "",
  });

  const [layout, setLayout] = useState(false);

  return (
    <main>
      <div className="grid grid-cols-[1fr] md:grid-cols-[300px_1fr]">
        <section className={`md:flex ${layout && "hidden"}`}>
          contact
          {/* Contact Component */}
        </section>
        <section className={`md:flex ${!layout && "hidden"}`}>
          chatclient
          {/* Chat Component */}
        </section>
      </div>
    </main>
  );
};

export default ChatClient;
