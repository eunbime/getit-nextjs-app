"use client";

import { useOpenChat } from "@/hooks/chat/useOpenChat";
import { cn } from "@/lib/utils";
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
      className={cn(
        "relative overflow-hidden rounded-full group",
        size === "sm" ? "w-10 h-10" : size === "md" ? "w-12 h-12" : "w-14 h-14",
        user ? "cursor-pointer" : ""
      )}
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
      {user && (
        <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <TbMessage size={30} />
        </div>
      )}
    </div>
  );
};

export default Avatar;
