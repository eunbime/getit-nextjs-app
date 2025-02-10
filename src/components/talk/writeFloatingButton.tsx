"use client";

import { Plus } from "lucide-react";
import FloatingButton from "../common/FloatingButton";
import { usePathname } from "next/navigation";

const WriteFloatingButton = () => {
  const pathname = usePathname();
  const isWritePage = pathname?.includes("/write");

  if (isWritePage) return null;

  return (
    <FloatingButton href={"/talk/write"}>
      <Plus />
    </FloatingButton>
  );
};

export default WriteFloatingButton;
