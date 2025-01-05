"use client";

import { useUserStore } from "@/store/userStore";
import Link from "next/link";
import { toast } from "react-toastify";

interface FloatingButtonProps {
  children: React.ReactNode;
  href: string;
}

const FloatingButton = ({ children, href }: FloatingButtonProps) => {
  const currentUser = useUserStore((state) => state.currentUser);

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
      aria-label="upload product"
      className="fixed flex items-center justify-center text-lg text-center text-white
    transition-colors bg-[#0d0c8f] border-0 border-transparent
    rounded-full shadow-xl cursor-pointer hover:bg-opacity-80
    aspect-square bottom-5 right-5 w-14"
    >
      {children}
    </Link>
  );
};

export default FloatingButton;
