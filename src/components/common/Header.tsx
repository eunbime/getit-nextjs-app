"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { TbMinus, TbPlus } from "react-icons/tb";

import { User } from "@prisma/client";
import NavItem from "@/components/navigation/NavItem";

interface HeaderProps {
  currentUser?: User | null;
}

const Header = ({ currentUser }: HeaderProps) => {
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const isTalkPage = pathname?.includes("/talk");
  const isUploadPage = pathname?.includes("/upload");

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  const handleMenu = () => {
    setMenu(!menu);
  };

  return (
    <header
      className="fixed bg-white top-0 z-10 w-full shadow-sm shadow-gray-200
    "
    >
      <nav className="flex items-center justify-between mx-auto max-w-[2520px] xl:px-20 md:px-10 sm:px-2 px-4">
        {/* logo */}
        <div className="flex items-center font-extrabold text-2xl h-14 text-main-blue gap-4">
          {pathname?.includes("/talk") ? (
            <>
              <Link href={"/talk"}>TALK!T</Link>
              <Link
                href={"/"}
                className="text-sm bg-main-blue text-white px-3 py-1 rounded-md mt-[1px]"
              >
                GET!T
              </Link>
            </>
          ) : (
            <>
              <Link href={"/"}>GET!T</Link>
              <Link
                href={"/talk"}
                className="text-sm bg-main-blue text-white px-3 py-1 rounded-md mt-[1px]"
              >
                TALK!T
              </Link>
            </>
          )}
        </div>

        {/* menu */}
        <div className="sm:hidden flex items-center gap-4">
          {isTalkPage || isUploadPage ? null : (
            <Link href={"/search"} aria-label="search">
              <IoSearch
                className="text-2xl text-main-blue"
                aria-label="search"
              />
            </Link>
          )}
          {menu === false ? (
            <button onClick={handleMenu}>
              <TbPlus className="text-2xl" />
            </button>
          ) : (
            <button onClick={handleMenu}>
              <TbMinus className="text-2xl" />
            </button>
          )}
        </div>

        {/* nav-item: screen*/}
        <div className="hidden sm:block relative">
          <Link
            href={"/search"}
            className="absolute top-3 -left-12"
            aria-label="search"
          >
            {isTalkPage || isUploadPage ? null : (
              <IoSearch className="text-2xl" aria-label="search" />
            )}
          </Link>

          <NavItem currentUser={currentUser} />
        </div>
      </nav>

      {/* nav-item: mobile*/}
      <nav className="block sm:hidden">
        {menu === false ? null : <NavItem mobile currentUser={currentUser} />}
      </nav>
    </header>
  );
};

export default Header;
