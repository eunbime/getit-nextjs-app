"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import NavItem from "./NavItem";
import { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { TbMinus, TbPlus } from "react-icons/tb";

interface NavBarProps {
  currentUser?: User | null;
}

const NavBar = ({ currentUser }: NavBarProps) => {
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
    <nav
      className="fixed bg-white top-0 z-10 w-full shadow-sm shadow-gray-200
    "
    >
      <div className="flex items-center justify-between mx-5 sm:mx-10 lg:mx-20">
        {/* logo */}
        <div className="flex items-center font-extrabold text-2xl h-14 text-[#0d0c8f] gap-4">
          {pathname?.includes("/talk") ? (
            <>
              <Link href={"/talk"}>TALK!T</Link>
              <Link
                href={"/"}
                className="text-sm bg-[#0d0c8f] text-white px-3 py-1 rounded-md mt-[1px]"
              >
                GET!T
              </Link>
            </>
          ) : (
            <>
              <Link href={"/"}>GET!T</Link>
              <Link
                href={"/talk"}
                className="text-sm bg-[#0d0c8f] text-white px-3 py-1 rounded-md mt-[1px]"
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
                className="text-2xl text-[#0d0c8f]"
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
        <div className="flex sm:block relative">
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
      </div>

      {/* nav-item: mobile*/}
      <div className="block sm:hidden">
        {menu === false ? null : <NavItem mobile currentUser={currentUser} />}
      </div>
    </nav>
  );
};

export default NavBar;
