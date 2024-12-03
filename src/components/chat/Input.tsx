"use client";

import axios from "axios";
import { FormEvent, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import { RiSendPlaneLine } from "react-icons/ri";

interface InputProps {
  receiverId: string;
  currentUserId: string;
}

const Input = ({ receiverId, currentUserId }: InputProps) => {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const imgUrl = "";

    if (message || imgUrl) {
      try {
        await axios.post("api/chat", {
          text: message,
          image: imgUrl,
          receiverId: receiverId,
          senderId: currentUserId,
        });
      } catch (error) {
        console.log(error);
      }
    }

    setMessage("");
  };

  const chooseImage = () => {};

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center justify-between w-full gap-4 p-2 pl-4 border-[1px] border-gray-300 rounded-md shadow-sm"
    >
      <input
        className="w-full text-base outline-none"
        type="text"
        placeholder="메시지를 입력해주세요."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div
        onClick={chooseImage}
        className="text-2xl text-gray-200 cursor-pointer"
      >
        <IoImageOutline />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center p-2 text-xl text-gray-900 bg-rose-400 rounded-lg cursor-pointer hover:bg-rose-400 disabled:opacity-60"
      >
        <RiSendPlaneLine className="text-white" />
      </button>
    </form>
  );
};

export default Input;
