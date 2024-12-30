"use client";

import { User } from "@prisma/client";
import Link from "next/link";
import { toast } from "react-toastify";

interface FloatingButtonProps {
  children: React.ReactNode;
  href: string;
  currentUser: User | null;
}

const FloatingButton = ({
  children,
  href,
  currentUser,
}: FloatingButtonProps) => {
  const handlerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!currentUser) {
      e.preventDefault();
      toast.warning("로그인 후 이용해주세요");
      return;
    }
  };

  return (
    <Link
      href={href}
      onClick={handlerClick}
      className="fixed flex items-center justify-center text-white
    transition-colors bg-zinc-500 border-0 border-transparent
    rounded-full shadow-xl cursor-pointer hover:bg-zinc-500
    aspect-square bottom-5 right-5 w-14"
    >
      {children}
    </Link>
  );
};

export default FloatingButton;
