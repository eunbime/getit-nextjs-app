"use client";

import { useOpenChat } from "@/hooks/chat/useOpenChat";
import { User } from "@prisma/client";
import Image from "next/image";
import { TbMessage } from "react-icons/tb";

interface AvatarProps {
  src: string | null | undefined;
  size?: "sm" | "md" | "lg";
  user?: User | null;
}

const Avatar = ({ src, size = "md", user }: AvatarProps) => {
  const { handleOpenChat } = useOpenChat({ user });
  return (
    <div
      className={`relative ${
        size === "sm" ? "w-10 h-10" : size === "md" ? "w-12 h-12" : "w-14 h-14"
      } overflow-hidden rounded-full group cursor-pointer`}
      onClick={handleOpenChat}
    >
      <Image
        src={src || "https://via.placeholder.com/400x400?text=no+user+image"}
        fill
        alt="Avatar"
        className="object-cover"
        loading="lazy"
        quality={80}
      />
      <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <TbMessage size={30} />
      </div>
    </div>
  );
};

export default Avatar;
