"use client";

import Link from "next/link";
import { useState } from "react";

import NavItem from "./NavItem";
import { User } from "@prisma/client";

interface NavBarProps {
  currentUser?: User | null;
}

const NavBar = ({ currentUser }: NavBarProps) => {
  const [menu, setMenu] = useState(false);

  const handleMenu = () => {
    setMenu(!menu);
  };

  return (
    <nav
      className="relative z-10 w-full bg-zinc-600 text-white
    "
    >
      <div className="flex items-center justify-between mx-5 sm:mx-10 lg:mx-20">
        {/* logo */}
        <div className="flex items-center text-2xl h-14">
          <Link href={"/"}>Logo</Link>
        </div>

        {/* menu */}
        <div className="text-2xl sm:hidden">
          {menu === false ? (
            <button onClick={handleMenu}>+</button>
          ) : (
            <button onClick={handleMenu}>-</button>
          )}
        </div>

        {/* nav-item: screen*/}
        <div className="hidden sm:block ">
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
