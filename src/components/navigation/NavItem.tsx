import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { User } from "@prisma/client";

interface NavItemProps {
  mobile?: boolean;
  currentUser?: User | null;
}

const NavItem = ({ mobile, currentUser }: NavItemProps) => {
  const pathname = usePathname();
  const isWritePage = pathname?.includes("/write");
  const isUploadPage = pathname?.includes("/upload");

  if (isWritePage || isUploadPage) return null;

  return (
    <div
      className={`text-md justify-center flex gap-4 w-full items-center ${
        mobile && "flex-col h-full"
      }`}
    >
      <Link
        href={"/user/favorites"}
        className="py-2 text-center border-b-4 hover:border-[#0d0c8f] cursor-pointer transition-all duration-300"
      >
        관심
      </Link>
      <Link
        href={"/chat"}
        className="py-2 text-center border-b-4 hover:border-[#0d0c8f] cursor-pointer transition-all duration-300"
      >
        채팅
      </Link>
      <Link
        href={"/user/profile"}
        className="py-2 text-center border-b-4 hover:border-[#0d0c8f] cursor-pointer transition-all duration-300"
      >
        마이페이지
      </Link>

      {currentUser ? (
        <button
          className="py-2 text-center border-b-4 hover:border-[#0d0c8f] cursor-pointer transition-all duration-300"
          onClick={() => signOut()}
        >
          로그아웃
        </button>
      ) : (
        <button
          className="py-2 text-center border-b-4 hover:border-[#0d0c8f] cursor-pointer transition-all duration-300"
          onClick={() => signIn()}
        >
          로그인
        </button>
      )}
    </div>
  );
};

export default NavItem;
