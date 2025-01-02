"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import NavItem from "./NavItem";
import { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import { IoSearch } from "react-icons/io5";

interface NavBarProps {
  currentUser?: User | null;
}

const NavBar = ({ currentUser }: NavBarProps) => {
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  const handleMenu = () => {
    setMenu(!menu);
  };

  return (
    <nav
      className="relative z-10 w-full bg-[#0d0c8f] text-white shadow-sm
    "
    >
      <div className="flex items-center justify-between mx-5 sm:mx-10 lg:mx-20">
        {/* logo */}
        <div className="flex items-center font-bold text-2xl h-14">
          <Link href={"/"}>SUPER</Link>
        </div>

        {/* menu */}
        <div className="text-2xl sm:hidden flex items-center gap-4">
          <Link href={"/search"} aria-label="search">
            <IoSearch className="text-2xl" aria-label="search" />
          </Link>
          {menu === false ? (
            <button onClick={handleMenu}>+</button>
          ) : (
            <button onClick={handleMenu}>-</button>
          )}
        </div>

        {/* nav-item: screen*/}
        <div className="hidden sm:block relative">
          <Link
            href={"/search"}
            className="absolute top-3 -left-12"
            aria-label="search"
          >
            <IoSearch className="text-2xl" aria-label="search" />
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
